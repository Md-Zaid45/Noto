import { Flashcard } from "../models/flashcard.model.js";
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
      throw new ApiError(500, "Failed to update flashcard");
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
    const updatedCard = await card.reviewUpdate(score);
    return res.status(200).json({
      success: true,
      message: "updated review successfully",
      payload: { flashcard: updatedCard },
    });
  } catch (error) {
    return next;
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
      throw new ApiError(500, "Failed to delete flashcards");

    return res.status.json({
      success: true,
      message: "Flashcards deleted successfully",
      deletedCount: deletedFlashcards.deletedCount,
      requestCount: ids.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getFlashcardActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const futureEnd = new Date();
    futureEnd.setDate(futureEnd.getDate() + 30);

    const [
      totalCards,
      activeCards,
      dueCards,
      reviewedCards,
      masteredCards,
      learningCards,
      newCards,
    ] = await Promise.all([
      Flashcard.countDocumetns({ _id: userId }),
      Flashcard.countDocuments({
        userId,
        revisionMark: true,
      }),
      Flashcard.countDocuments({
        userId,
        revisionMark: true,
        nextReview: new Date(),
      }),

      Flashcard.countDocuments({
        userId,
        revisionMark: true,
        updatedAt: {
          $gte: start,
          $lte: end,
        },
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
        repetitions: { $gte: 0, $lte: 3 },
      }),
    ]);

    const futureCards = await Flashcard.aggregate([
      {$match:{userId, revisionMark: true, nextReview: { $gt: end, $lte: futureEnd }}},
      {$group:{nextReview: { $dateToString: { format: "%Y-%m-%d", date: "$nextReview" } }, count: { $sum: 1 }}},
      {$sort: { nextReview: 1 }}
    ])
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
      },
    });
  } catch (error) {
    return next(error);
  }
};
