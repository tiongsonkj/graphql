import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import cors from 'cors';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';

import db from './src/db';
import models from './src/models';
import resolvers from './src/resolvers';
import typeDefs from './src/schema';


dotenv.config();

const app = express();
// security middleware
app.use(helmet());
// cors middleware
app.use(cors());
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST || 'mongodb://localhost:27017/test';
db.connect(DB_HOST);

// get the user info from a JWT
const getUser = (token: string) => {
    if (token) {
      try {
        // return the user information from the token
        return jwt.verify(token, process.env.JWT_SECRET ?? '');
      } catch (err) {
        // if there's a problem with the token, throw an error
        throw new Error('Session invalid');
      }
    }
};

// Apollo Server setup
const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: async ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization;
        // try to retrieve a user with the token
        const user = getUser(token ?? '');
        // add the db models and the user to the context
        return { models, user };
    }
});

const runServer = async () => {
    // without this, apollo will throw an error.
    await server.start();
    await server.applyMiddleware({ app, path: '/api' });
};
// Apply the Apollo GraphQL middleware and set the path to /api
runServer();

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);