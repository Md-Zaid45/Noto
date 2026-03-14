import { User } from "../models/user.model.js";

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
    console.log("error registering user", error);
    next(error)
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
    console.log("error loging in user", error);
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
    if(!loggedOUtUser){
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }
    console.log(loggedOUtUser);
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
