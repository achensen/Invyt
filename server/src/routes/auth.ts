import dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : "",
            accessToken,
            refreshToken,
          }).save();
        } else {
          await User.updateOne(
            { googleId: profile.id },
            { accessToken, refreshToken }
          );
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

// Serialize user (stores user ID in session)
passport.serializeUser((user: any, done) => {
  done(null, user._id.toString());
});

// Deserialize user (retrieves user details from ID)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Route for Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for Google login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    if (!req.user) {
      console.error("❌ No user found in request after authentication");
      return res.redirect("/");
    }

    const user = req.user as any;

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

export default router;
