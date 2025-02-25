import jwt from "jsonwebtoken";
import { Request } from "express";

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

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedUser;
    console.log("✅ Token Decoded:", decoded);
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        console.error("❌ JWT Expired:", error.message);
      } else {
        console.error("❌ Invalid Token:", error.message);
      }
    } else {
      console.error("❌ Unknown Error:", error);
    }
    return null;
  }
};

export default authMiddleware;
