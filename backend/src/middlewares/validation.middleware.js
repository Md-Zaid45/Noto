import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const validateEmail = (req, res, next) => {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(401, "invalid email");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validateFields = (req, res, next) => {
  try {
    const fields = Object.values(req.body);

    if (fields.some((field) => field.trim() === "")) {
      throw new ApiError(400, "Empty field");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const checkUserExisted = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.exists({ email });
    if (user) {
     throw new ApiError(409, "user already existed");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validateCredentials = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "user not found");
    }
    const validPass = await user.isPasswordCorrect(password);
    if (!validPass) {
      throw new ApiError(401, "incorrect password");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyJwt = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Token is required");
    }
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};
