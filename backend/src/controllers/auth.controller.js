import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

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
      .cookie("accessToken", accToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .cookie("refreshToken", refToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        message: "login user successfully",
        payload: { name: req.user.name, email: req.user.email },
      });
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
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .json({
        success: true,
        message: "logged out user successfully",
      });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refToken = req.cookies.refreshToken;
    const decoded = jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    const storedToken = user.refreshToken;

    if (storedToken !== refToken) {
      throw new ApiError(401, "Refresh token is not matched");
    }
    const newAccToken = user.generateAccessToken();
    const newRefToken = user.generateRefreshToken();

    user.refreshToken = newRefToken;
    user.save();
    return res
      .status(200)
      .cookie("accessToken", newAccToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .cookie("refreshToken", newRefToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      })
      .json({
        success: true,
        message: "refreshed tokens successfully",
        payload: { name: decoded.name, email: decoded.email },
      });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies.accessToken ||
      req.headers.authorization?.replace("Bearer ", "");
    console.log("accesstoken in me", accessToken);

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).json({
      success: true,
      payload: { name: decoded.name, email: decoded.email },
    });
  } catch (error) {
    return next(error);
  }
};
