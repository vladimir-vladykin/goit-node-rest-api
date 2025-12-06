import jwt from "jsonwebtoken";
import "dotenv/config";
import passport from "passport";
import passportJWT from "passport-jwt";
import { User } from "../db/db.js";

const secret = process.env.SECRET_KEY;
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(params, async function (payload, done) {
    const id = payload.id;
    
    const user = await User.findOne({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      done(new Error("User not found"));
      return;
    }

    done(null, user);
  })
);

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      console.log(err);
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Unauthorized",
        data: "Unauthorized",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const createUserToken = (userId, email) => {
  const payload = {
    id: userId,
    email: email,
  };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export { createUserToken, auth };
