import { Collection, ObjectId } from "mongodb";
import { connectDB } from "../config/db";

interface Like {
  _id?: ObjectId;
  id: string;
  postId: string;
  userId: string;
  commentId: string;
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
    commentId: string,
    userId: string
  ): Promise<void> {
    if (!LikeModel.collection) {
      throw new Error("Collection is not inited yet");
    }

    const post = await getPost(postId);
    if(!post) {
      throw new Error("Post not found");
    }
    const existingLike  = await getLike(postId, userId);
    if (existingLike) {
      throw new Error("You already liked this post");
    }

    // crear nuevo like
    const like: Like = {
      id: generateId(),
      postId,
      userId,
      commentId,
      likesNumber: 1,
      createdAt: new Date()
    }
    await saveLike();
    await updatePostLikes(postId, like.likesNumber)
    return like
  };
  static async unLikeContent(likeId: string): Promise<void> {
    if(!LikeModel.collection) {
        throw new Error("Collection is not inited yet");
    }
    await LikeModel.collection.deleteOne({ _id: new ObjectId(likeId) })
  }
  static async getLikesCount(
    contentType: string,
    contentId: string
  ): Promise<number> {
    if (!LikeModel.collection) {
      throw new Error("Collection is not inited yet");
    }
    const existingLike = await LikeModel.collection.findOne({
      contentType,
      contentId,
    });
    return existingLike ? existingLike.likesNumber : 0;
  }
}
