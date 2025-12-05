import jwt from "jsonwebtoken";
import "dotenv/config";

const secret = process.env.SECRET_KEY;

const createUserToken = (userId, email) => {
  const payload = {
    id: userId,
    email: email,
  };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export { createUserToken };
