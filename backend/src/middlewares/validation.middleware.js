import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const validateEmail = (req, res, next) => {
  try {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("invalid email");
      error.statusCode = 401
      throw error
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validateFields = (req, res, next) => {
  try {
    console.log(req.body);
    const fields = Object.values(req.body);

    if (fields.some((field) => field.trim() === "")) {
      const error = new Error("Empty field");
      error.statusCode = 400
      throw error
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
      const error = new Error("user already existed");
      error.statusCode = 409
      throw error
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
      const error = new Error("user not found");
      error.statusCode = 404
      throw error
    }
    console.log(user);
    const validPass = await user.isPasswordCorrect(password);
    if (!validPass) {
      const error = new Error("incorrect password");
      error.statusCode = 401
      throw error
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
      const error = new Error("Token is required");
      error.statusCode = 401
      throw error
    }
    const verifiedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};
