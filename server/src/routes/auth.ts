import dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback, GoogleCallbackParameters } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../models/User.js";

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
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/gmail.send"
      ],
      passReqToCallback: true,
    },
    async function (
      _req: express.Request,
      accessToken: string,
      refreshToken: string,
      _params: GoogleCallbackParameters,
      profile: Profile,
      done: VerifyCallback
    ) {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails ? profile.emails[0].value : "",
            accessToken,
            refreshToken,
          });
        } else {
          user.accessToken = accessToken;

          // Ensure the refresh token is always stored if provided
          if (refreshToken && refreshToken !== user.refreshToken) {
            user.refreshToken = refreshToken;
          }
        }

        await user.save(); // Save user after changes
        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

// Add authorization parameters to request offline access
passport.authorize("google", {
  accessType: "offline",
  prompt: "consent",
});



// Serialize User (Session Storage)
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize User (Retrieve from DB)
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
    const err = error as any;
    console.error("Failed to refresh Google token:", err.response?.data || err.message);
    return null;
  }
};

// FIXED: Google Login Route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://mail.google.com/"], // 
    accessType: "offline", // Forces refreshToken
    prompt: "consent", // Forces Google to resend refreshToken
  })
);

// Google Callback Route

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      if (!req.user) {
        console.error("No user found after authentication");
        return res.redirect("/login");
      }

      const user = req.user as IUser;

      // Ensure refreshToken is stored
      if (!user.refreshToken) {
        console.log("Storing new refresh token...");
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { refreshToken: user.refreshToken },
          { new: true }
        );

        console.log("✅ Refresh token stored:", updatedUser?.refreshToken);
      }

      // Generate JWT Token including Access Token
      const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001'
      const token = jwt.sign(
        { 
          userId: user._id, 
          name: user.name, 
          email: user.email,
          accessToken: user.accessToken, // Include Access Token
        },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      console.log("Google Login Successful - Redirecting with Token");

      // Redirect back to frontend with token
      res.redirect(`${baseUrl}?token=${token}`);
    } catch (error) {
      console.error("Error during Google callback:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


// Refresh Google Access Token Route
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
    const err = error as any;
    console.error("Error refreshing token:", err.message || err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { refreshGoogleToken };
export default router;