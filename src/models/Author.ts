import { Collection, ObjectId } from 'mongodb';
import { connectDB } from '../config/db';

export interface Author {
    _id?: ObjectId;
    name: string;
    avatarImage: string;
    description: string;
    posts?: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export class AuthorModel {
    private static collection: Collection<Author>;
    public static async init(): Promise<void> {
        const db = await connectDB();
        AuthorModel.collection = db.collection<Author>('authors');
    }
    public static async createAuthor(author: Author): Promise<void> {
        try {
            if(!AuthorModel.collection) {
                console.log('Author collection not initilized');
            }
            await AuthorModel.collection.insertOne({
                ...author,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error creating author: ', error)
        }
    }
    static async updateAuthor(authorId: string, authorData: any): Promise<void> {
        try {
            if (!AuthorModel.collection) {
                throw new Error('Author collection not initilized');
            }
            await AuthorModel.collection.updateOne({
                _id: new ObjectId(authorId)
            }, {
                $set: authorData
            });

        } catch (error) {
            console.log('Error', error)
        }
    }
    static async deleteAuthor(authorId: string): Promise<void> {
        try {
            if(!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            await AuthorModel.collection.deleteOne({
                _id: new ObjectId(authorId)
            });

        } catch (error) {
            console.log('Error deleting author: ', error);
        }
    }
    static async getAuthorById(authorId: string): Promise<Author | null> {
        try {
            if(!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            return await AuthorModel.collection.findOne({ _id: new ObjectId(authorId)});
        } catch (error) {
            console.log('', error)
            return null;
        }
    }
    static async getAllAuthors(): Promise<Author[]> {
        let authors: Author[] = [];
        if (!AuthorModel.collection) {
            throw new Error('Author collection not initialized');
        }
        try {
            authors = await AuthorModel.collection.find({}).toArray();
            
        } catch (error) {
            console.error('Error getting all authors: ', error);
        }
        return authors;
    }
}