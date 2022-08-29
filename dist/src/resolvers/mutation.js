"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const gravatar_1 = __importDefault(require("../util/gravatar"));
exports.default = {
    newNote: async (parent, args, { models, user }) => {
        // if there is no user on the context, throw an authentication error
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError('You must be signed in to create a note');
        }
        return await models.Note.create({
            content: args.content,
            // reference the author's mongo id
            author: new mongoose_1.default.Types.ObjectId(user.id)
        });
    },
    deleteNote: async (parent, { id }, { models }) => {
        try {
            await models.Note.findOneAndRemove({ _id: id });
            return true;
        }
        catch (err) {
            return false;
        }
    },
    updateNote: async (parent, { content, id }, { models }) => {
        try {
            return await models.Note.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    content
                }
            }, {
                new: true
            });
        }
        catch (err) {
            throw new Error('Error updating note');
        }
    },
    signUp: async (parent, { username, email, password }, { models }) => {
        // normalize email address
        email = email.trim().toLowerCase();
        // hash the password
        const hashed = await bcrypt_1.default.hash(password, 10);
        // create the gravatar url
        const avatar = (0, gravatar_1.default)(email);
        try {
            const user = await models.User.create({
                username,
                email,
                avatar,
                password: hashed
            });
            // create and return the json web token
            return jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || '');
        }
        catch (err) {
            // if there's a problem creating the account, throw an error
            throw new Error('Error creating account');
        }
    },
    signIn: async (parent, { username, email, password }, { models }) => {
        var _a;
        if (email) {
            // normalize email address
            email = email.trim().toLowerCase();
        }
        const user = await models.User.findOne({
            $or: [{ email }, { username }]
        });
        // if no user is found, throw an authentication error
        if (!user) {
            throw new apollo_server_express_1.AuthenticationError('Error signing in');
        }
        // if the passwords don't match, throw an authentication error
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            throw new apollo_server_express_1.AuthenticationError('Error signing in');
        }
        // create and return the json web token
        return jsonwebtoken_1.default.sign({ id: user._id }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : '');
    }
};
