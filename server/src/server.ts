import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import typeDefs from "./schemas/typeDefs.js";
import resolvers from "./schemas/resolvers.js";
import authMiddleware from "./utils/auth.js";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// Configure Sessions (Required for Passport)
app.use(
  session({
    secret: process.env.JWT_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize() as express.RequestHandler);
app.use(passport.session() as express.RequestHandler);

// Authentication Routes
app.use("/auth", authRoutes);

const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in the environment variables.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.start().then(() => {
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = authMiddleware({ req });
        console.log("📌 User Context Middleware:", user);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
