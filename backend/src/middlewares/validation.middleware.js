import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const checkUserExists = async (req, res, next) => {
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

export const checkExists = (model, location = "params", field = "id") => {
  return async (req, res, next) => {
    try {
      const value = req[location]?.[field];

      if (!value) next();

      const document = await model.findOne({
        _id: value,
        userId: req.user._id,
      });

      if (!document) {
        throw new ApiError(404, `Document not found for ${field}: ${value}`);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
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

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Token is required");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) throw new ApiError(404, "user not found");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req);
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.params !== undefined) req.params = parsed.params;
    if (parsed.query !== undefined) req.query = parsed.query;
    next();
  } catch (error) {
    next(error);
  }
};
