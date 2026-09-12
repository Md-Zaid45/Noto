import { Flashcard } from "../models/flashcard.model.js";
import { Note } from "../models/note.model.js";
import ApiError from "../utils/ApiError.js";

export const getNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ userId: req.user._id, _id: id });
    if (!note) return res.status(404).json({ success: false });
    return res.status(200).json({
      success: true,
      payload: {
        note,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const newNote = await Note.create({
      ...req.body,
      userId: req.user._id,
    });
    if (!newNote) throw new ApiError(500, "Unable to create note");

    return res.status(201).json({
      success: true,
      payload: {
        note: newNote,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteNotes = async (req, res, next) => {
  try {
    const { ids } = req.body;
    const deletedNotes = await Note.deleteMany({
      _id: { $in: ids },
      userId: req.user._id,
    });
    if (deletedNotes.deletedCount === 0)
      throw new ApiError(404, "Note does not exists");

    return res.status(200).json({
      success: true,
      message: "Notes deleted successfully",
      deletedCount: deletedNotes.deletedCount,
      requestCount: ids.length,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      { $set: { ...req.body, isIndexed: false } },
      { returnDocument: "after", runValidators: true },
    );
    if (!updatedNote) throw new ApiError(404, "Unable to find note");

    return res.status(200).json({
      success: true,
      payload: { note: updatedNote },
    });
  } catch (error) {
    return next(error);
  }
};

export const getNoteCount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const count = await Note.countDocumetns({ _id: userId });

    return res.status(200).json({
      success: true,
      payload: {
        notesCount: count,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const recentNotes = async (req, res, next) => {
  try {
    const recents = req.body;
    const ids = recents?.tabs.map((tab) => tab.id);
    const recentNotes = await Note.find({
      userId: req.user._id,
      _id: { $in: ids },
    }).select("_id name content type ");

    if (recents?.tabs.length == 0 || recentNotes?.length == 0) {
      return res.status(200).json({
        payload: {
          folders: req.folders,
          notes: req.notes,
          notesContent: [],
          flashcards: [],
        },
      });
    }
    req.notesContent = recentNotes;
    return next();
  } catch (error) {
    return next(error);
  }
};
