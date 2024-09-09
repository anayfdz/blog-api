import { Collection, ObjectId } from "mongodb";
import { connectDB } from "../config/db";
import { PostModel } from "./Post";
interface Like {
  _id?: ObjectId;
  postId: string;
  userId: string;
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
    postId: string,
    userId: string
  ): Promise<void> {
    if (!LikeModel.collection) {
      throw new Error("Collection is not inited yet");
    }

    // Busca el post usando el ID proporcionado como string

    const post = await PostModel.getPostById(postId);
    if(!post) {
      throw new Error("Post not found");
    }
     // Busca si ya existe un "like" para el post y el usuario dados
    const existingLike = await LikeModel.collection.findOne({
      postId,
      userId 
    });

    if (existingLike) {
       // Si existe, incrementa el número de "likes"
      await LikeModel.collection.updateOne(
        { _id: existingLike._id },
        {$inc: { likesNumber: 1},
       $set: { updatedAt: new Date() } }
      );
    } else {
      // Si no existe, crea un nuevo "like"
      await LikeModel.collection.insertOne({
        postId,
        userId,
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
  static async getLikesCount(
  ): Promise<number> {
    if (!LikeModel.collection) {
      throw new Error("Collection is not inited yet");
    }
    const existingLike = await LikeModel.collection.findOne();
    return existingLike ? existingLike.likesNumber : 0;
  }
}
