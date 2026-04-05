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
