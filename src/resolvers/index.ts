import Query from './query';
import Mutation from './mutation';
import Note from './note';
import User from './user';
import { GraphQLDateTime } from 'graphql-iso-date';

export default {
  Query,
  Mutation,
  Note,
  User,
  DateTime: GraphQLDateTime
};