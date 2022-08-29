"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const note_1 = __importDefault(require("./note"));
const user_1 = __importDefault(require("./user"));
const models = {
    Note: note_1.default,
    User: user_1.default
};
exports.default = models;
