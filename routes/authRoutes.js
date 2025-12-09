import express from "express";
import {
  currentUser,
  login,
  logout,
  register,
  resendVerification,
  updateAvatar,
  verifyUser,
} from "../controllers/authControllers.js";
import { auth } from "../services/tokens.js";
import { upload } from "../services/uploadFiles.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, currentUser);
authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
authRouter.get("/verify/:verificationToken", verifyUser);
authRouter.post("/verify", resendVerification)

export default authRouter;
