"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorModel = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class AuthorModel {
    static async init() {
        const db = await (0, db_1.connectDB)();
        AuthorModel.collection = db.collection('authors');
        console.log('Author collection initialized');
    }
    static async createAuthor(authorData) {
        try {
            if (!AuthorModel.collection) {
                console.log('Author collection not initilized');
            }
            const newId = new mongodb_1.ObjectId();
            await AuthorModel.collection.insertOne({
                ...authorData,
                id: newId.toString(),
                postID: [],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        catch (error) {
            console.error('Error creating author: ', error);
        }
    }
    static async addPostToAuthor(authorId, postId) {
        try {
            if (!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            await AuthorModel.collection.updateOne({ id: authorId }, { $push: { postID: postId } });
        }
        catch (error) {
            console.log('Error adding post to author: ', error);
        }
    }
    //hola
    static async updateAuthor(authorId, authorData) {
        try {
            if (!AuthorModel.collection) {
                throw new Error('Author collection not initilized');
            }
            await AuthorModel.collection.updateOne({
                _id: new mongodb_1.ObjectId(authorId)
            }, {
                $set: authorData
            });
        }
        catch (error) {
            console.log('Error', error);
        }
    }
    static async deleteAuthor(authorId) {
        try {
            if (!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            await AuthorModel.collection.deleteOne({
                _id: new mongodb_1.ObjectId(authorId)
            });
        }
        catch (error) {
            console.log('Error deleting author: ', error);
        }
    }
    static async getAuthorById(authorId) {
        try {
            await AuthorModel.init();
            if (!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            if (!mongodb_1.ObjectId.isValid(authorId)) {
                throw new Error(`Invalid authorId: ${authorId}`);
            }
            const author = await AuthorModel.collection.findOne({ _id: new mongodb_1.ObjectId(authorId) });
            console.log("aqui la consulkta", author);
            if (!author) {
                console.log(`Author not found with ID: ${authorId}`);
            }
            return author;
        }
        catch (error) {
            console.log('', error);
            return null;
        }
    }
    static async getAllAuthors() {
        let authors = [];
        if (!AuthorModel.collection) {
            throw new Error('Author collection not initialized');
        }
        try {
            authors = await AuthorModel.collection.find({}).toArray();
        }
        catch (error) {
            console.error('Error getting all authors: ', error);
        }
        return authors;
    }
    static async getAuthorByEmail(email) {
        try {
            await AuthorModel.init();
            if (!AuthorModel.collection) {
                throw new Error('Author collection not initialized');
            }
            const author = await AuthorModel.collection.findOne({ email });
            if (!author) {
                console.log(`Author not found with email: ${email}`);
            }
            return author;
        }
        catch (err) {
            console.log('Error in Author', err);
            return null;
        }
    }
}
exports.AuthorModel = AuthorModel;
