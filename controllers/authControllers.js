import { User } from "../db/db.js";
import { registrationSchema } from "../schemas/authSchemas.js";
import { getUserByEmail, createUser } from "../services/authServices.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

export const register = async (req, res, next) => {
  const { error } = registrationSchema.validate(req.body);
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
