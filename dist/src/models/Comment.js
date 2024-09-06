"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const Post_1 = require("./Post");
const LikeCounter_1 = require("./LikeCounter");
class CommentModel {
    static async init() {
        const db = await (0, db_1.connectDB)();
        CommentModel.collection = db.collection("comments");
    }
    static async createComment(commentData) {
        try {
            if (!CommentModel.collection) {
                throw new Error("Comment collection not initialized");
            }
            const postId = commentData.post;
            const post = await Post_1.PostModel.getPostById(postId.toString());
            if (!post) {
                throw new Error("Post no encontrado");
            }
            const commentResult = {
                ...commentData,
                commentLikes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            post.comments.push(commentResult);
            await Post_1.PostModel.addCommentToPost(commentData.post, commentResult);
        }
        catch (err) {
            console.error("E", err);
        }
    }
    static async updateComment(id, commentData) {
        try {
            if (!CommentModel.collection) {
                throw new Error("Comment collection not initialized");
            }
            const updateData = { ...commentData, updatedAt: new Date() };
            await CommentModel.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...updateData, updatedAt: new Date() } });
        }
        catch (error) {
            console.error("Error updating comment: ", error);
        }
    }
    static async deleteComment(id) {
        try {
            if (!CommentModel.collection) {
                throw new Error("Comment collection not initialized");
            }
            await CommentModel.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        }
        catch (error) {
            console.error("Error deleting comment", error);
        }
    }
    static async getCommentById(id) {
        try {
            if (!CommentModel.collection) {
                throw new Error("Comment collection not initialized");
            }
            return await CommentModel.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        }
        catch (error) {
            throw new Error("Error getting comment by ID: " + error.message);
        }
    }
    static async getAllComments() {
        try {
            if (!CommentModel.collection) {
                throw new Error("Comment collection not initialized");
            }
            return await CommentModel.collection.find({}).toArray();
        }
        catch (error) {
            throw new Error("Error getting all comments: " + error.message);
        }
    }
    static async likeComment(id, userId) {
        try {
            if (!CommentModel.collection) {
                throw new Error("Comment collection not initialized");
            }
            // Primero, incrementa los likes en el comentario
            const commentUpdateResult = await CommentModel.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $inc: { commentLikes: 1 }, $set: { updatedAt: new Date() } });
            //console.log("incremento likes en comentario", commentUpdateResult);
            if (commentUpdateResult.matchedCount === 0) {
                throw new Error("Failed to update comment likes");
            }
            //   const comment = await CommentModel.getCommentById(id);
            //   console.log("Obtener el comentario para obtener el postId", comment);
            //   if (!comment) {
            //     throw new Error("Comment not found");
            //   }
            // Luego, actualiza el contador de likes en la colección de likes
            const comment = await CommentModel.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
            console.log("aqui estoyy", comment);
            if (!comment) {
                throw new Error("Comment not found after update");
            }
            // Actualizar el contador de likes en la colección de likes
            await LikeCounter_1.LikeModel.likeContent(comment.post.toString(), userId);
            const updateResult = await Post_1.PostModel.getCollection().updateOne({ _id: new mongodb_1.ObjectId(comment.post) }, {
                $inc: {
                    "comments.$[elem].commentLikes": 1,
                },
            }, { arrayFilters: [{ "elem.post": comment.post }], upsert: false });
            if (updateResult.modifiedCount === 0) {
                throw new Error("Failed to update post comments");
            }
            console.log("Actualización de commentLikes en el post");
        }
        catch (error) {
            console.log("Error al dar like al comentario:", error);
        }
    }
    static async findComments(query) {
        try {
            if (!CommentModel.collection) {
                throw new Error("Comment collection not initialized");
            }
            const comments = await CommentModel.collection.find(query).toArray();
            return comments;
        }
        catch (error) {
            console.error("Error finding comments:", error);
            return [];
        }
    }
}
exports.CommentModel = CommentModel;
CommentModel.collection = null;
