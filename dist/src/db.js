"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = {
    connect: (DB_HOST) => {
        // Use the Mongo driver's updated URL string parser
        // mongoose.set('useNewUrlParser', true);
        // Use `findOneAndUpdate()` in place of findAndModify()
        // mongoose.set('useFindAndModify', false);
        // Use `createIndex()` in place of `ensureIndex()`
        // mongoose.set('useCreateIndex', true);
        // Use the new server discovery & monitoring engine
        // mongoose.set('useUnifiedTopology', true);
        // Connect to the DB
        mongoose_1.default.connect(DB_HOST);
        // Log an error if we fail to connect
        mongoose_1.default.connection.on('error', err => {
            console.error(err);
            console.log('MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });
    },
    close: () => {
        mongoose_1.default.connection.close();
    }
};
