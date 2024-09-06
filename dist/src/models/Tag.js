"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const db_1 = require("../config/db");
class TagModel {
    static async init() {
        const db = await (0, db_1.connectDB)();
        TagModel.collection = db.collection('tags');
    }
    ;
    static async createTag(tagData) {
        if (!TagModel.collection)
            throw new Error("Collection not initialized");
        const result = await TagModel.collection?.insertOne({
            ...tagData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    ;
    static async getAllTags() {
        try {
            if (!TagModel.collection) {
                throw new Error('Tag collection not initialized');
            }
            return await TagModel.collection.find({}).toArray();
        }
        catch (err) {
            console.error('Error getting all tags', err);
        }
        return [];
    }
}
exports.TagModel = TagModel;
TagModel.collection = null;
