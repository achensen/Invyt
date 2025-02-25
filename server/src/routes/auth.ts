import dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";

const router = express.Router();

// Define User Interface
interface IUser {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
}

// Google OAuth Strategy
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
          // Create new user if not found
          user = await new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : "",
            accessToken,
            refreshToken,
          }).save();
        } else {
          // Update only if tokens changed
          if (user.accessToken !== accessToken || user.refreshToken !== refreshToken) {
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            await user.save();
          }
        }

        return done(null, {
          _id: user._id.toString(),
          googleId: user.googleId,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken ?? "",
          refreshToken: user.refreshToken ?? "",
        });
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

// Serialize User (Store in Session)
passport.serializeUser((user: any, done) => {
  done(null, user._id); // Store only the user ID in the session
});

// Deserialize User (Retrieve from Session)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


// Function to Refresh Google Access Token
const refreshGoogleToken = async (refreshToken: string) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to refresh Google token:", error);
    return null;
  }
};

// Google Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback Route (After Successful Login)
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    if (!req.user) {
      console.error("No user found after authentication");
      return res.redirect("/login");
    }

    const user = req.user as IUser;

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    console.log("Google Login Successful - Redirecting with Token");

    // Redirect back to frontend with token
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// Refresh Google Access Token
router.get("/refresh-token", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized - No Token Found" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };

    const user = await User.findOne({ email: decoded.email });

    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Invalid User or Missing Refresh Token" });
    }

    const newAccessToken = await refreshGoogleToken(user.refreshToken);
    
    if (!newAccessToken) {
      return res.status(500).json({ message: "Failed to refresh Google Token" });
    }

    user.accessToken = newAccessToken;
    await user.save();

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
