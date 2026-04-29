import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { Flashcard } from "../models/flashcard.model.js";
import ApiError from "../utils/ApiError.js";

export const getFolderStructure = async (req, res, next) => {
  try {
    const folders = await Folder.find({ userId: req.user._id });
    const notes = await Note.find({ userId: req.user._id }).select('_id folderId name revisionMark type')
    const notesContent = await Note.find({ userId: req.user._id }).select('_id  name content type')
    const flashcards = await Flashcard.find({ userId: req.user._id });
    return res.status(200).json({
      payload: {
        folders,
        notes,
        flashcards,
        notesContent
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createFolder = async (req, res, next) => {
  try {

    const newFolder = await Folder.create({
  ...req.body,
  userId: req.user._id,
});
    if (!newFolder) throw new ApiError(500, "Failed to create new folder");

    return res.status(201).json({
      success: true,
      payload: {
        folder: newFolder,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFolders = async (req, res, next) => {
  try {
    const { ids } = req.body;
  console.log("folder controller deletion ids");
  
    const deletedFolders = await Folder.deleteMany({
      _id: { $in: ids },
      userId: req.user._id,
    });

    if (deletedFolders.deletedCount === 0)
      throw new ApiError(500, "Unable to delete folders");

    return res.status(200).json({
      success: true,
      message: "Folder deleted successfully",
      deletedCount: deletedFolders.deletedCount,
      requestCount: ids.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFolder = await Folder.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      {
        $set: req.body,
      },
      { new: true, runValidators: true },
    );

    if (!updatedFolder) throw new ApiError(500, "Failed to update the folder");

    return res.status(200).json({
      success: true,
      payload: {
        folder: updatedFolder,
      },
    });
  } catch (error) {
    next(error);
  }
};
