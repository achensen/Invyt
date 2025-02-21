import jwt from "jsonwebtoken";
import { Request } from "express";

const authMiddleware = async (req: Request) => {
  const token = req.headers.authorization || "";
  if (!token) return null;

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET || "secret");
    return decoded;
  } catch (error) {
    return null;
  }
};

export default authMiddleware;