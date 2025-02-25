import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import typeDefs from "./schemas/typeDefs.js"; 
import resolvers from "./schemas/resolvers.js";
import authMiddleware from "./utils/auth.js"; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
        const user = await authMiddleware({ req });
        console.log("📌 User Context Middleware:", user);
        return { user };
      },
    })
  );

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
