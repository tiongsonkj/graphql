"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
const gravatar = (email) => {
    const hash = (0, md5_1.default)(email);
    return `https://www.gravatar.com/avatar/${hash}.jpg?d=identicon`;
};
exports.default = gravatar;
