import { Flashcard } from "../models/flashcard.model.js";
import { ReviewLog } from "../models/reviewLog.model.js";
import { Note } from "../models/note.model.js";
import ApiError from "../utils/ApiError.js";

export const createFlashcard = async (req, res, next) => {
  try {
    const newFlashcard = await Flashcard.create({
      ...req.body,
      userId: req.user._id,
    });

    if (!newFlashcard) throw new ApiError(500, "Failed to create flashcard");

    return res.status(201).json({
      success: true,
      payload: {
        flashcard: newFlashcard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateFlashcard = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedFlashcard = await Flashcard.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true },
    );
    if (!updatedFlashcard)
      throw new ApiError(404, "Failed to update flashcard");
    return res.status(200).json({
      success: true,
      payload: {
        flashcard: updatedFlashcard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const reviewUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const card = await Flashcard.findById(id);
    if (!card) throw new ApiError(404, "Flashcard not found");
    const previousInterval = card.interval;
    const previousEaseFactor = card.easeScore;
    const updatedCard = await card.updateReview(score);
    const newInterval = updatedCard.interval;
    const newEaseFactor = updatedCard.easeScore;
    const review = await ReviewLog.create({
      flashcardId:id,
      userId:req.user._id,
      quality:score,
      previousInterval,
      previousEaseFactor,
      newInterval,
      newEaseFactor
    })
    await review.save();
    return res.status(200).json({
      success: true,
      message: "updated review successfully",
      payload: { flashcard: updatedCard },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteFlashcards = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const deletedFlashcards = await Flashcard.deleteMany({
      _id: { $in: ids },
      userId: req.user._id,
    });
    if (deletedFlashcards.deletedCount === 0)
      throw new ApiError(404, "Failed to delete flashcards");

    return res.status(200).json({
      success: true,
      message: "Flashcards deleted successfully",
      payload: { ids },
      deletedCount: deletedFlashcards.deletedCount,
      requestCount: ids.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getFlashcardsActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const futureEnd = new Date();
    futureEnd.setDate(futureEnd.getDate() + 30);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    weekAgo.setHours(0, 0, 0, 0);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 27);
    monthAgo.setHours(0, 0, 0, 0);
         const [
      totalCards,
      activeCards,
      dueCards,
      reviewedCards,
      masteredCards,
      learningCards,
      newCards,
      weeklyActivity,
      dailyActivity,
      totalReviews,
      correctReviews,
      streakDays,
    ] = await Promise.all([
      Flashcard.countDocuments({ userId }),
      Flashcard.countDocuments({ userId, revisionMark: true }),
      Flashcard.countDocuments({
        userId,
        revisionMark: true,
        nextReview: { $lte: new Date() },
      }),
      Flashcard.countDocuments({
        userId,
        revisionMark: true,
        updatedAt: { $gte: start, $lte: end },
      }),
      Flashcard.countDocuments({
        userId,
        revisionMark: true,
        interval: { $gte: 30 },
      }),
      Flashcard.countDocuments({
        userId,
        revisionMark: true,
        repetitions: { $gte: 3 },
      }),
      Flashcard.countDocuments({
        userId,
        revisionMark: true,
        repetitions: { $gte: 0, $lte: 2 },
      }),
      ReviewLog.aggregate([
        { $match: { userId  } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      ReviewLog.aggregate([
        { $match: { userId,  } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      ReviewLog.countDocuments({ userId }),
      ReviewLog.countDocuments({ userId, quality: { $gte: 3 } }),
      ReviewLog.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 365 },
      ]),
    ]);

    const futureCards = await Flashcard.aggregate([
      {
        $match: {
          userId,
          revisionMark: true,
          
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$nextReview" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const accuracy =
      totalReviews > 0
        ? Math.round((correctReviews / totalReviews) * 1000) / 10
        : 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const day of streakDays) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - streak);
      const dayStr = expected.toISOString().slice(0, 10);
      if (day._id === dayStr) streak++;
      else break;
    }
    return res.status(200).json({
      success: true,
      payload: {
        totalCards,
        activeCards,
        dueCards,
        reviewedCards,
        masteredCards,
        learningCards,
        newCards,
        futureCards,
        weeklyActivity,
        dailyActivity,
        dailyReviewed: reviewedCards,
        accuracy,
        streak,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getDeckStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const deckAgg = await Flashcard.aggregate([
      { $match: { userId, revisionMark: true } },
      {
        $group: {
          _id: "$noteId",
          totalCards: { $sum: 1 },
          dueCards: {
            $sum: { $cond: [{ $lte: ["$nextReview", new Date()] }, 1, 0] },
          },
          masteredCards: {
            $sum: { $cond: [{ $gte: ["$interval", 30] }, 1, 0] },
          },
        },
      },
    ]);
    const noteIds = deckAgg.map((d) => d._id);
    const notes = await Note.find({ _id: { $in: noteIds } }).select(
      "name folderId",
    );
    const result = deckAgg.map((d) => {
      const note = notes.find((n) => n._id.equals(d._id));
      return {
        noteId: d._id,
        name: note?.name || "Unknown",
        folderId: note?.folderId || null,
        totalCards: d.totalCards,
        dueCards: d.dueCards,
        mastery:
          d.totalCards > 0
            ? Math.round((d.masteredCards / d.totalCards) * 100)
            : 0,
      };
    });
    return res.status(200).json({ success: true, payload: result });
  } catch (error) {
    next(error);
  }
};

export const getFlashcards = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const query = {
      userId,
      revisionMark: true,
      nextReview: { $lte: new Date() },
    };
    if (id) query.noteId = id;
    else throw new ApiError(400, "note id is empty");
    const flashcards = await Flashcard.find(query)
      .sort({ nextReview: 1 })
      .limit(50);
    return res.status(200).json({
      success: true,
      payload: {
        flashcards,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const getFlashcardsByNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    if (!id) throw new ApiError(400, "note id is empty");
    const flashcards = await Flashcard.find({ userId, noteId: id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      payload: { flashcards },
    });
  } catch (error) {
    return next(error);
  }
};

export const recentFlashcards = async (req, res, next) => {
  try {
    const recents = req.body;

    const userId = req.user._id;
    const query = {
      userId,
      revisionMark: true,
      nextReview: { $lte: new Date() },
    };
    let flashcards = [];
    if (recents?.tabs.length) {
      const ids = recents.tabs.map((tab) => tab.id);
      query.noteId = { $in: ids };
      flashcards = await Flashcard.find(query)
        .sort({ nextReview: 1 })
        .limit(50);
    }
    return res.status(200).json({
      success: true,
      payload: {
        folders: req.folders,
        notes: req.notes,
        notesContent: req.notesContent,
        flashcards,
      },
    });
  } catch (error) {
    return next(error);
  }
};
