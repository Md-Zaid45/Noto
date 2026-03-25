import { User } from "../models/user.model.js";
import { Folder } from "../models/folder.model.js";
import { Note } from "../models/note.model.js";
import { Flashcard } from "../models/flashcard.model.js";
import ApiError from "../utils/ApiError.js";

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
