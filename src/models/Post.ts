import { ObjectId, Collection, Db } from "mongodb";
import { connectDB } from "../config/db";
interface Post {
    _id?: ObjectId;
    title: string;
    content: string;
    authorId: string;
    categoryIds: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export class PostModel {
    private static collection: Collection<Post> | null = null;
    static async init() {
        const db = await connectDB();
        PostModel.collection = db.collection<Post>('posts');
    }
    static async createPost(post: Post): Promise<void> {
        try {
            if(!PostModel.collection) {
                throw new Error('Collection is not inited');
            }
            await PostModel.collection.insertOne({ 
                ...post,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

        } catch (err) {
            console.error('Error creating post',err);
        }
    };
    static async getAllPosts(): Promise<Post[]> {
        try {
            if(!PostModel.collection) {
                throw new Error("Collection isn't initialized");
            }
            const posts = await PostModel.collection.find({}).sort({createdAt:-1}).toArray();
            return posts;

        } catch (error) {
             console.error('Error getting all posts', error);
        }
        return [];
    };
    static async getPostById(id: string): Promise<Post|null> {
        try {
            if (!PostModel.collection) {
                throw new Error('Post collection not initialized');
            }
            const post = await PostModel.collection.findOne({_id: new ObjectId(id)})
            return post;
        } catch (error) {
            console.error('Error getting post by id', error)
        }
        return null;
    };
    static async updatePost(id: string, postData: Partial<Post>): Promise<void> {
        try {
            if (!PostModel.collection) {
                throw new Error('Post collection not initialized');
            }
            await PostModel.collection.updateOne({_id: new ObjectId(id)}, {$set: postData});
        } catch (error) {
            console.error( 'Error updating post', error);
        }
    };
    static async deletePost(id:string): Promise<void> {
        try {
            if (!PostModel.collection) {
                throw new Error('Post collection not initialized');
            }
            await PostModel.collection.deleteOne({ _id: new ObjectId(id)});
        } catch (error) {
            console.error( 'Error deleting post', error)
        }
    };
}