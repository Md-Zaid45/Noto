import { Router } from "express";
import {
  getFolderStructure,
  getNote,
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

router.get("/workspace", verifyJwt, getFolderStructure);

router.get("/notes/:id",verifyJwt, getNote)

export default router;
