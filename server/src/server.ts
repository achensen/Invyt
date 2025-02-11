import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schemas/typeDefs';
import resolvers from './schemas/resolvers';
import authMiddleware from './utils/auth';

dotenv.config();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

server.start().then(() => {
  app.use('/graphql', expressMiddleware(server, { context: authMiddleware }));
  app.listen(3001, () => console.log('Server running on port 3001'));
});