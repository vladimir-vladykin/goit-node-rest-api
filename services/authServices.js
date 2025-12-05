import { User } from "../db/db.js";

async function getUserByEmail(email) {
  return await User.findOne({
    where: {
      email: email,
    },
  });
}

async function createUser(email, hashedPassword) {
  const user = await User.create({
    email: email,
    password: hashedPassword,
  });

  return user;
}

async function updateUserToken(user, token) {
  user.token = token;
  await user.save();
  return user;
}

export { getUserByEmail, createUser, updateUserToken };
