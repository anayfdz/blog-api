import { ObjectId, Collection } from "mongodb";
import { connectDB } from '../config/db';

interface Comment {
    _id?: ObjectId;
    parentComment?: ObjectId;
    post: ObjectId;
    author: string;
    authorEmail: string;
    ipAddress: string;
    content: string;
    isAproved: boolean;
    commentLikes: number;
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
            await CommentModel.collection.insertOne({
                ...commentData,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

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
}