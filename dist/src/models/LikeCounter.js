"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModel = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const Post_1 = require("./Post");
class LikeModel {
    static async init() {
        const db = await (0, db_1.connectDB)();
        LikeModel.collection = db.collection("likes");
    }
    static async likeContent(postId, userId) {
        if (!LikeModel.collection) {
            throw new Error("Collection is not inited yet");
        }
        // Busca el post usando el ID proporcionado como string
        const post = await Post_1.PostModel.getPostById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        // Busca si ya existe un "like" para el post y el usuario dados
        const existingLike = await LikeModel.collection.findOne({
            postId,
            userId
        });
        if (existingLike) {
            // Si existe, incrementa el número de "likes"
            await LikeModel.collection.updateOne({ _id: existingLike._id }, { $inc: { likesNumber: 1 },
                $set: { updatedAt: new Date() } });
        }
        else {
            // Si no existe, crea un nuevo "like"
            await LikeModel.collection.insertOne({
                postId,
                userId,
                likesNumber: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }
    ;
    static async unLikeContent(likeId) {
        if (!LikeModel.collection) {
            throw new Error("Collection is not inited yet");
        }
        await LikeModel.collection.deleteOne({ _id: new mongodb_1.ObjectId(likeId) });
    }
    static async getLikesCount() {
        if (!LikeModel.collection) {
            throw new Error("Collection is not inited yet");
        }
        const existingLike = await LikeModel.collection.findOne();
        return existingLike ? existingLike.likesNumber : 0;
    }
}
exports.LikeModel = LikeModel;
LikeModel.collection = null;
