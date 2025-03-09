import jwt from "jsonwebtoken";
import { Request } from "express";

// Define User Data Structure
interface DecodedUser {
  userId: string;
  name: string;
  email: string;
}

// Middleware to Verify JWT Tokens
const authMiddleware = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ No authorization header found.");
    return null;
  }

  const token = authHeader.replace("Bearer ", ""); // Extract JWT token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedUser;
    // console.log("✅ Token Decoded:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Invalid Token:", error);

    // Handle Expired Token Case
    if (error instanceof jwt.TokenExpiredError) {
      console.log("⏳ Token has expired. Consider requesting a refresh token.");
    }

    return null;
  }
};

export default authMiddleware;
