"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const LikeCounter_1 = require("../models/LikeCounter");
class LikeController {
    static async likeContent(req, res) {
        try {
            const { postId, userId } = req.body;
            await LikeCounter_1.LikeModel.likeContent(postId, userId);
            res.status(201).send({ message: "Liked!" });
        }
        catch (e) {
            console.error("Error liking", e);
            res.status(500).send({ message: "Server error" });
        }
    }
    static async unlikeContent(req, res) {
        try {
            const likeId = req.params.id;
            await LikeCounter_1.LikeModel.unLikeContent(likeId);
            res.status(200).send({ message: "Unliked!" });
        }
        catch (e) {
            console.error("Error unlike", e);
        }
    }
}
exports.LikeController = LikeController;
