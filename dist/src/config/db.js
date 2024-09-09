"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('Missing MONGO environment variable');
}
let cacheDb = null;
const client = new mongodb_1.MongoClient(uri, {
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 5000,
});
async function connectDB() {
    if (cacheDb) {
        return cacheDb;
    }
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('blog');
        cacheDb = db;
        return db;
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw new Error('Could not connect to MongoDB');
        //process.exit();
    }
}
