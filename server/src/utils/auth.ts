import jwt from "jsonwebtoken";
import { Request } from "express";

// Define the structure of decoded token
interface DecodedUser {
  userId: string;
  name: string;
  email: string;
}

const authMiddleware = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ No authorization header found.");
    return null;
  }

  const token = authHeader.replace("Bearer ", ""); // Extract JWT token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedUser;
    console.log("✅ Token Decoded:", decoded);
    return decoded; // Returns user object with userId, name, email
  } catch (error) {
    console.error("❌ Invalid Token:", error);
    return null;
  }
};

export default authMiddleware;
