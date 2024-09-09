"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const Tag_1 = require("../models/Tag");
class TagController {
    static async getAllTags(req, res) {
        try {
            const tags = await Tag_1.TagModel.getAllTags();
            res.status(200).json({ tags });
        }
        catch (err) {
            console.error('Error getting all tags: ', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    ;
    static async createTag(req, res) {
        try {
            const tagData = req.body;
            await Tag_1.TagModel.createTag(tagData);
            res.status(200).json({ message: "Tag created successfully" });
        }
        catch (err) {
            console.error('Error creating tag: ', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.TagController = TagController;
