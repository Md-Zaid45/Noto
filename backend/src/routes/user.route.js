import { Router } from "express";
import {
  getFolderStructure,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import {
  checkUserExisted,
  validateCredentials,
  validateEmail,
  validateFields,
  verifyJwt,
} from "../middlewares/validation.middleware.js";

const router = Router();

router.post(
  "/signup",
  validateFields,
  validateEmail,
  checkUserExisted,
  registerUser,
);
router.post(
  "/login",
  validateFields,
  validateEmail,
  validateCredentials,
  loginUser,
);
router.post("/logout", verifyJwt, logoutUser);

export default router;
