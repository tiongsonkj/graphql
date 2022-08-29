"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const apollo_server_express_1 = require("apollo-server-express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./src/db"));
const models_1 = __importDefault(require("./src/models"));
const resolvers_1 = __importDefault(require("./src/resolvers"));
const schema_1 = __importDefault(require("./src/schema"));
// Provide resolver functions for our schema fields
// const resolvers = {
//     Mutation: {
//       newNote: async (parent: any, args: { content: string; }) => {
//         return await models.Note.create({
//             content: args.content,
//             author: 'Adam Scott'
//         });
//       }
//     }
// };
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST || 'mongodb://localhost:27017/test';
db_1.default.connect(DB_HOST);
// get the user info from a JWT
const getUser = (token) => {
    var _a;
    if (token) {
        try {
            // return the user information from the token
            return jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '');
        }
        catch (err) {
            // if there's a problem with the token, throw an error
            throw new Error('Session invalid');
        }
    }
};
// Apollo Server setup
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default,
    context: ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization;
        // try to retrieve a user with the token
        const user = getUser(token !== null && token !== void 0 ? token : '');
        // for now, let's log the user to the console:
        console.log({ user });
        // add the db models and the user to the context
        return { models: models_1.default, user };
    }
});
const runServer = async () => {
    // without this, apollo will throw an error.
    await server.start();
    await server.applyMiddleware({ app, path: '/api' });
};
// Apply the Apollo GraphQL middleware and set the path to /api
runServer();
app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`));
