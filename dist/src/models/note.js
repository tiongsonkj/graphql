"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define the note's database schema
const noteSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    // Assigns createdAt and updatedAt fields with a Date type
    timestamps: true
});
// Define the 'Note' model with the schema
const Note = mongoose_1.default.model('Note', noteSchema);
// Export the module
exports.default = Note;
