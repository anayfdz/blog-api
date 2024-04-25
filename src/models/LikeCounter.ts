import { Collection, ObjectId } from "mongodb";
import { connectDB } from "../config/db";

interface Like {
  _id?: ObjectId;
  contentType: string;
  contentId: string;
  likesNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export class LikeModel {
  private static collection: Collection<Like> | null = null;
  static async init() {
    const db = await connectDB();
    LikeModel.collection = db.collection<Like>("likes");
  }

  static async likeContent(
    contentType: string,
    contentId: string
  ): Promise<void> {
    if (!LikeModel.collection) {
      throw new Error("Collection is not inited yet");
    }
    const existingLike = await LikeModel.collection.findOne({
      contentType,
      contentId,
    });
    if (existingLike) {
      await LikeModel.collection.updateOne(
        { contentType, contentId },
        { $inc: { likesNumber: 1 }, $set: { updatedAt: new Date() } }
      );
    } else {
      await LikeModel.collection.insertOne({
        contentId,
        contentType,
        likesNumber: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };
  static async unLikeContent(likeId: string): Promise<void> {
    if(!LikeModel.collection) {
        throw new Error("Collection is not inited yet");
    }
    await LikeModel.collection.deleteOne({ _id: new ObjectId(likeId) })
  }
}
