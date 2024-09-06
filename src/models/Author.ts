import { Collection, ObjectId } from 'mongodb';
import { connectDB } from '../config/db';

export interface Author {
    _id?: ObjectId;
    id: string;
    name: string;
    avatarImage?: string;
    description?: string;
    postID: string[];
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export class AuthorModel {
    private static collection: Collection<Author>;
    public static async init(): Promise<void> {
        const db = await connectDB();
        AuthorModel.collection = db.collection<Author>('authors');
        console.log('Author collection initialized');
    }
    public static async createAuthor(authorData: Omit<Author, 'id' | '_id' | 'postID' | 'createdAt' | 'updatedAt'>): Promise<void> {
        try {
            if(!AuthorModel.collection) {
                console.log('Author collection not initilized');
            }
            const newId = new ObjectId();
            await AuthorModel.collection.insertOne({
                ...authorData,
                id: newId.toString(),
                postID: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error creating author: ', error)
        }
    }

    public static async addPostToAuthor(authorId: string, postId: string): Promise<void> {
        try {
            if(!AuthorModel.collection) {
                throw new Error('Author collection not initialized')
            }
            await AuthorModel.collection.updateOne({id: authorId},{$push: { postID: postId }})
    } catch (error) {
        console.log('Error adding post to author: ', error)
    }
}
//hola
    static async updateAuthor(authorId: string,authorData: Partial<Omit<Author, 'id' | '_id' | 'postID' | 'createdAt' | 'updatedAt'>>): Promise<void> {
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
            await AuthorModel.init();
            if(!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            if (!ObjectId.isValid(authorId)) {
                throw new Error(`Invalid authorId: ${authorId}`);
            }
            const author = await AuthorModel.collection.findOne({ _id: new ObjectId(authorId)});
            console.log("aqui la consulkta",author)
            if (!author) {
                console.log(`Author not found with ID: ${authorId}`);
            }
            return author;
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
    static async getAuthorByEmail(email: string): Promise<Author | null> {
        try{
            await AuthorModel.init();
            if(!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            const author = await AuthorModel.collection.findOne({ email });
            if (!author) {
                console.log(`Author not found with email: ${email}`)
            }
            return author;
        } catch(err) {
            console.log('Error in Author', err)
            return null;
        }
    }
}