import { User } from "../db/db.js";
import { authSchema } from "../schemas/authSchemas.js";
import {
  getUserByEmail,
  createUser,
  updateUserToken,
} from "../services/authServices.js";
import bcrypt from "bcrypt";
import { createUserToken } from "../services/tokens.js";
const saltRounds = 10;

export const register = async (req, res, next) => {
  const { error } = authSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (user) {
    res.status(409).json({
      message: "Email in use",
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const { subscription } = await createUser(email, hashedPassword);

    res.status(201).json({
      user: {
        email: email,
        subscription: subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res) => {
  const { error } = authSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      message: error.message,
    });
    return;
  }

  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(401).json({
      message: "Email or password is wrong",
    });
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).json({
      message: "Email or password is wrong",
    });
    return;
  }

  const token = createUserToken(user.id, user.email);
  await updateUserToken(user, token);

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
