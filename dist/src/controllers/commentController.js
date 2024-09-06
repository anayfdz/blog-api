"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const Comment_1 = require("../models/Comment");
const LikeCounter_1 = require("../models/LikeCounter");
const Post_1 = require("../models/Post");
class CommentController {
    static async createComment(req, res) {
        try {
            const commentData = { ...req.body };
            if (!commentData.post || !commentData.content) {
                res.status(400).json({ message: 'Post ID and content are required' });
                return;
            }
            await Comment_1.CommentModel.createComment(commentData);
            res.status(200).json({ message: 'Comment created successfully' });
        }
        catch (error) {
            console.error('Error in creating comment', error);
            res.status(500).json({ message: 'Error creating comment' });
        }
    }
    ;
    static async updateComment(req, res) {
        try {
            const { id } = req.params;
            const commentData = req.body;
            await Comment_1.CommentModel.updateComment(id, commentData);
            res.status(200).json({ message: 'Comment updated successfully' });
        }
        catch (error) {
            console.error('Error updating comment', error);
        }
    }
    ;
    static async deleteComment(req, res) {
        try {
            const { id } = req.params;
            await Comment_1.CommentModel.deleteComment(id);
            res.status(200).json({ message: 'Deleted Successfully!' });
        }
        catch (error) {
            console.log("Delete Error", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    ;
    static async getCommentById(req, res) {
        try {
            const { id } = req.params;
            const comment = await Comment_1.CommentModel.getCommentById(id);
            res.status(200).json(comment);
        }
        catch (error) {
            console.error('Error getting the comment by id', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    ;
    static async getAllComments(req, res) {
        try {
            const comments = await Comment_1.CommentModel.getAllComments();
            res.status(200).json(comments);
        }
        catch (error) {
            console.error('Error getting all comments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async likeComment(req, res) {
        try {
            const { postId, userId } = req.body;
            await LikeCounter_1.LikeModel.likeContent(postId, userId);
            await Post_1.PostModel.updateCommentLikes(postId);
            res.status(200).send({ message: 'Comment liked successfully' });
        }
        catch (error) {
            console.error('Error liking comment:', error);
            res.status(500).send({ message: 'Error liking comment' });
        }
    }
}
exports.CommentController = CommentController;
