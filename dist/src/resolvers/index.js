"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = __importDefault(require("./query"));
const mutation_1 = __importDefault(require("./mutation"));
const graphql_iso_date_1 = require("graphql-iso-date");
exports.default = {
    Query: query_1.default,
    Mutation: mutation_1.default,
    DateTime: graphql_iso_date_1.GraphQLDateTime
};
