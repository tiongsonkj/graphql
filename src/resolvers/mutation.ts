import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
    AuthenticationError,
    ForbiddenError
} from 'apollo-server-express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import gravatar from '../util/gravatar';

export default {
    newNote: async (parent: any, args: { content: string; }, { models, user }: any) => {
        // if there is no user on the context, throw an authentication error
        if (!user) {
            throw new AuthenticationError('You must be signed in to create a note');
        }

        return await models.Note.create({
            content: args.content,
            // reference the author's mongo id
            author: new mongoose.Types.ObjectId(user.id)
        });
    },
    deleteNote: async (parent: any, { id }: { id: string }, { models, user }: any) => {
        // if not a user, throw an Authentication Error
        if (!user) {
            throw new AuthenticationError('You must be signed in to delete a note');
        }

        // find the note
        const note = await models.Note.findById(id);
        // if the note owner and current user don't match, throw a forbidden error
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to delete the note");
        }

        try {
            // if everything checks out, remove the note
            await note.remove();
            return true;
        } catch (err) {
            // if there's an error along the way, return false
            return false;
        }
    },
    updateNote: async (parent: any, { content, id }: { content: string; id: string; }, { models, user }: any) => {
        // if not a user, throw an Authentication Error
        if (!user) {
            throw new AuthenticationError('You must be signed in to update a note');
        }
    
        // find the note
        const note = await models.Note.findById(id);
        // if the note owner and current user don't match, throw a forbidden error
        if (note && String(note.author) !== user.id) {
            throw new ForbiddenError("You don't have permissions to update the note");
        }
    
        // Update the note in the db and return the updated note
        return await models.Note.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },
    signUp: async (parent: any, { username, email, password }: { username: string; email: string; password: string; }, { models }: any) => {
        // normalize email address
        email = email.trim().toLowerCase();
        // hash the password
        const hashed = await bcrypt.hash(password, 10);
        // create the gravatar url
        const avatar = gravatar(email);
        try {
          const user = await models.User.create({
            username,
            email,
            avatar,
            password: hashed
          });
    
          // create and return the json web token
          return jwt.sign({ id: user._id }, process.env.JWT_SECRET || '');
        } catch (err) {
          // if there's a problem creating the account, throw an error
          throw new Error('Error creating account');
        }
    },
    signIn: async (parent: any, { username, email, password }: { username: string; email: string; password: string; }, { models }: any) => {
        if (email) {
          // normalize email address
          email = email.trim().toLowerCase();
        }
    
        const user = await models.User.findOne({
          $or: [{ email }, { username }]
        });
    
        // if no user is found, throw an authentication error
        if (!user) {
          throw new AuthenticationError('Error signing in');
        }
    
        // if the passwords don't match, throw an authentication error
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new AuthenticationError('Error signing in');
        }
    
        // create and return the json web token
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? '');
    },
    toggleFavorite: async (parent: any, { id }: any, { models, user }: any) => {
        // if no user context is passed, throw auth error
        if (!user) {
          throw new AuthenticationError('No user');
        }
    
        // check to see if the user has already favorited the note
        let noteCheck = await models.Note.findById(id);
        const hasUser = noteCheck.favoritedBy.indexOf(user.id);
    
        // if the user exists in the list
        // pull them from the list and reduce the favoriteCount by 1
        if (hasUser >= 0) {
          return await models.Note.findByIdAndUpdate(
            id,
            {
              $pull: {
                favoritedBy: new mongoose.Types.ObjectId(user.id)
              },
              $inc: {
                favoriteCount: -1
              }
            },
            {
              // Set new to true to return the updated doc
              new: true
            }
          );
        } else {
          // if the user doesn't exists in the list
          // add them to the list and increment the favoriteCount by 1
          return await models.Note.findByIdAndUpdate(
            id,
            {
              $push: {
                favoritedBy: new mongoose.Types.ObjectId(user.id)
              },
              $inc: {
                favoriteCount: 1
              }
            },
            {
              new: true
            }
          );
        }
    },
};