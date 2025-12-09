import { User } from "../db/db.js";

async function getUserByEmail(email) {
  return await User.findOne({
    where: {
      email: email,
    },
  });
}

async function getUserByVerifycationToken(verificationToken) {
  return await User.findOne({
    where: {
      verificationToken: verificationToken,
    },
  });
}

async function createUser(email, hashedPassword, avatarURL, verificationToken) {
  const user = await User.create({
    email: email,
    password: hashedPassword,
    avatarURL: avatarURL,
    verificationToken: verificationToken,
  });

  return user;
}

async function updateUserToken(user, token) {
  user.token = token;
  await user.save();
  return user;
}

async function updateUserAvatarURL(userId, avatarURL) {
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (user) {
    user.avatarURL = avatarURL;
    await user.save();
  }
}

async function markUserAsVerified(user) {
  user.verificationToken = null;
  user.verify = true;

  await user.save();
  return user;
}

export {
  getUserByEmail,
  getUserByVerifycationToken,
  createUser,
  updateUserToken,
  updateUserAvatarURL,
  markUserAsVerified,
};
