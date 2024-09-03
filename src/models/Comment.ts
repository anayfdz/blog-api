import { ObjectId, Collection } from "mongodb";
import { connectDB } from '../config/db';
import { PostModel } from "./Post";

export interface Comment {
    _id?: ObjectId;
    post: ObjectId;
    author: string;
    content: string;
    commentLikes?: number;
    createdAt: Date;
    updatedAt: Date;
}

export class CommentModel {
    private static collection: Collection<Comment> | null = null;
    static async init() {
        const db = await connectDB();
        CommentModel.collection = db.collection<Comment>('comments');
    }
    static async createComment(commentData: Comment): Promise<void> {
        try {
            if (!CommentModel.collection) {
                throw new Error('Comment collection not initialized');
            }
            const postId = commentData.post;
            const post = await PostModel.getPostById(postId.toString());
            if (!post) {
                throw new Error('Post no encontrado');
              }

            const commentResult = {
                ...commentData,
                commentLikes: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            post.comments.push(commentResult);
            await PostModel.updatePost(postId.toString(), { comments: post.comments})

        } catch (err) {
            console.error('E',err);
        }
    }
    static async updateComment(id: string, commentData: Partial<Comment>): Promise<void> {
        try {
            if (!CommentModel.collection) {
                throw new Error('Comment collection not initialized');
            }
            await CommentModel.collection.updateOne(
                {_id: new ObjectId(id)}, { $set: {...commentData, updatedAt: new Date()}})
        } catch (error) {
            console.error('Error updating comment: ', error);
        }
    };
    static async deleteComment(id: string) {
        try {
            if (!CommentModel.collection) {
                throw new Error('Comment collection not initialized');
            }
            await CommentModel.collection.deleteOne({ _id: new ObjectId(id)});

        } catch (error) {
            console.error('Error deleting comment', error);
        }
    };
    static async getCommentById(id: string): Promise<Comment | null> {
        try {
            if (!CommentModel.collection) {
                throw new Error('Comment collection not initialized');
            }
            return await CommentModel.collection.findOne({ _id: new ObjectId(id) });
        } catch (error: any) {
            throw new Error('Error getting comment by ID: ' + error.message);
        }
    }

    static async getAllComments(): Promise<Comment[]> {
        try {
            if (!CommentModel.collection) {
                throw new Error('Comment collection not initialized');
            }
            return await CommentModel.collection.find({}).toArray();
        } catch (error: any) {
            throw new Error('Error getting all comments: ' + error.message);
        }
    }
    static async likeComment(id: string): Promise<void> {
        try{
            if(!CommentModel.collection) {
                throw new Error('Comment collection not initialized');
            }
            await CommentModel.collection.updateOne({_id: new ObjectId(id)},{$inc: { commentLikes: 1}})
        } catch(error) {
            console.log('Error linking comment:',error)
        }
    }
    static async findComments(query: Partial<Comment>): Promise<Comment[]> {
        try {
          if (!CommentModel.collection) {
            throw new Error('Comment collection not initialized');
          }
          const comments = await CommentModel.collection.find(query).toArray();
          return comments;
        } catch (error) {
          console.error('Error finding comments:', error);
          return []
        }
      }
}