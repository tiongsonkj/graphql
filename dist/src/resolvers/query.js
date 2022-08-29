"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    notes: async (parent, args, { models }) => {
        return await models.Note.find();
    },
    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id);
    }
};
