import { User } from "../models/user.model.js";
import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { Flashcard } from "../models/flashcard.model.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    return res.status(200).json({
      success: true,
      user: { userId: user._id, name: user.name, email: user.email },
      message: "user successfully created",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const user = req.user;
    const accToken = user.generateAccessToken();
    const refToken = user.generateRefreshToken();

    user.refreshToken = refToken;
    await user.save({ validateBeforeSave: false });

    return res
      .cookie("accessToken", accToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refToken, { httpOnly: true, secure: true })
      .status(200)
      .json({ success: true, message: "login user successfully" });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const loggedOUtUser = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true },
    );
    if (!loggedOUtUser) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .clearCookie("accessToken", { httpOnly: true, secure: true })
      .clearCookie("refreshToken", { httpOnly: true, secure: true })
      .json({
        success: true,
        message: "logged out user successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const getFolderStructure = async (req, res, next) => {
  try {
    const folders = await Folder.find({ userId: req.user._id });
    const notes = await Note.find({ userId: req.user._id });
    const flashcards = await Flashcard.find({ userId: req.user._id });
    console.log(folders, notes);
    return res.status(200).json({
      payload: {
        folders,
        notes,
        flashcards,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ApiError(400, "invalid note id");
    const note = await Note.findOne({ userId: req.user._id, _id: id });
    if (!note) throw new ApiError(404, "Cannot find note");
    return res.status(200).json({
      success: true,
      payload: {
        note,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNoteContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ApiError(400, "Invalid note id");

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { title, content } },
      { new: true, runValidators: true },
    );

    if (!updatedNote) throw new ApiError(500, "Updation failed");
    return res.status(200).json({
      success: true,
      payload: { note: updatedNote },
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { name, folderId, content, revisionMark } = req.body;

    if (!name.trim()) throw new ApiError(400, "Name is required");

    if (typeof revisionMark !== "boolean")
      throw new ApiError(400, "Invalid revision mark");

    if (!mongoose.Types.ObjectId.isValid(folderId))
      throw new ApiError(400, "Invalid folder id");

    const newNote = await Note.create({
      name,
      folderId,
      content,
      revisionMark,
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
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ApiError(400, "Invalid note id");

    const deletedNote = await Note.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!deletedNote) throw new ApiError(404, "Note does not exists");

    await Flashcard.deleteMany({ userId: req.user._id, noteId: id });

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ApiError(400, "Invalid note id");

    const { title, folderId, revisionMark } = req.body;

    if (!mongoose.Types.ObjectId.isValid(folderId))
      throw new ApiError(400, "Invalid folder id");

    const fields = Object.fromEntries(
      Object.entries({ title, folderId, revisionMark }).filter(
        ([_, val]) => val !== undefined && val !== "",
      ),
    );

    if (Object.keys(fields).length === 0)
      throw new ApiError(400, "Empty fields");

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id,
      },
      { $set: fields },
      { new: true, runValidators: true },
    );

    if (!updatedNote) throw new ApiError(404, "Unable to find note");

    return res.status(200).json({
      success: true,
      payload: { note: updatedNote },
    });
  } catch (error) {
    next(error);
  }
};
