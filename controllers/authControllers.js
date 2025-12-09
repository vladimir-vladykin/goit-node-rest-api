import { authSchema } from "../schemas/authSchemas.js";
import {
  getUserByEmail,
  createUser,
  updateUserToken,
  updateUserAvatarURL,
  getUserByVerifycationToken,
  markUserAsVerified,
} from "../services/authServices.js";
import gravatar from "gravatar";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { createUserToken } from "../services/tokens.js";
import { saveFile } from "../services/uploadFiles.js";
import { sendVerificationEmail } from "../services/email.js";

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
    const avatarURL = gravatar.url(email, { protocol: "https" });
    const verificationToken = nanoid();
    const { subscription } = await createUser(
      email,
      hashedPassword,
      avatarURL,
      verificationToken
    );

    sendVerificationEmail(email, getBaseUrl(req), verificationToken);
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

  const isVerified = user.verify;
  if (!isVerified) {
    res.status(401).json({
      message: "You have to verify your email first",
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

export const logout = async (req, res) => {
  const user = req.user;
  await updateUserToken(user, null);

  res.status(204).json();
};

export const currentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

export const updateAvatar = async (req, res, next) => {
  const { id } = req.user;

  try {
    const avatarURL = await saveFile(id, req.file);
    await updateUserAvatarURL(id, avatarURL);
    res.json({
      avatarURL: avatarURL,
    });
  } catch (err) {
    return next(err);
  }
};

export const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await getUserByVerifycationToken(verificationToken);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  await markUserAsVerified(user);
  res.status(200).json({
    message: "Verification successful",
  });
};

function getBaseUrl(req) {
  const protocol = req.protocol;
  const host = req.get("host");

  return `${protocol}://${host}`;
}
