import { Collection, ObjectId } from 'mongodb';
import { connectDB } from '../config/db';


interface Tag {
    _id?: ObjectId;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

export class TagModel {
    private static collection: Collection<Tag> | null = null;
    static async init() {
        const db = await connectDB();
        TagModel.collection = db.collection<Tag>('tags');
    };
    static async createTag(tagData: Tag): Promise<void> {
        if(!TagModel.collection) throw new Error("Collection not initialized");
        const result = await TagModel.collection?.insertOne({
        ...tagData,
        createdAt: new Date(),
        updatedAt: new Date()
        });
    };
     static async getAllTags(): Promise<Tag[]> {
        try {
            if (!TagModel.collection) {
                throw new Error('Tag collection not initialized');
            }
            return await TagModel.collection.find({}).toArray();
        } catch (err) {
            console.error('Error getting all tags', err);
        }
        return [];
     } 
    
}