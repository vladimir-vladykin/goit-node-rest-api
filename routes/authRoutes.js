import express from "express";
import {
  currentUser,
  login,
  logout,
  register,
  updateAvatar,
} from "../controllers/authControllers.js";
import { auth } from "../services/tokens.js";
import { upload } from "../services/uploadFiles.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, currentUser);
authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default authRouter;
