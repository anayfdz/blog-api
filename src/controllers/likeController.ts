import { Request, Response } from "express";
import { LikeModel } from "../models/LikeCounter";

export class LikeController {
  static async likeContent(req: Request, res: Response): Promise<void> {
    try {
      const { contentType, contentId } = req.body;
      await LikeModel.likeContent(contentType, contentId);
      res.status(201).send({ message: "Liked!" });
    } catch (e) {
      console.error("Error liking", e);
      res.status(500).send({ message: "Server error" });
    }
  }
  static async unlikeContent(req: Request, res: Response): Promise<void> {
    try {
      const likeId = req.params.id;
      await LikeModel.unLikeContent(likeId);
      res.status(200).send({ message: "Unliked!" });
    } catch (e) {
      console.error("Error unlike", e);
    }
  }
}
