import express from "express";
import { currentUser, login, logout, register } from "../controllers/authControllers.js";
import { auth } from "../services/tokens.js";

const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, currentUser)

export default authRouter;
