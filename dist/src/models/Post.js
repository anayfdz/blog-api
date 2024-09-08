"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
const Author_1 = require("./Author");
const Comment_1 = require("./Comment");
const uploadCloudinary_1 = require("../config/uploadCloudinary");
class PostModel {
    static async init() {
        const db = await (0, db_1.connectDB)();
        PostModel.collection = db.collection("posts");
    }
    static getCollection() {
        if (!PostModel.collection) {
            throw new Error("No post collection");
        }
        return PostModel.collection;
    }
    static async createPost(postData, author, file) {
        try {
            if (!PostModel.collection) {
                throw new Error("Collection is not inited");
            }
            if (!author) {
                throw new Error("Author ID is required");
            }
            let imageUrl = '';
            if (file) {
                const publicId = file.originalname.replace(/\.[^/.]+$/, "");
                const buffer = file.buffer;
                try {
                    const result = await (0, uploadCloudinary_1.uploadImage)(buffer, publicId);
                    console.log("HOOYYY:", result);
                    imageUrl = result.imageUrl;
                    ;
                }
                catch (error) {
                    console.error('Error uploading image:', error);
                    // imageUrl = "";
                }
            }
            console.log("Model - imageUrl after uploadImage:", imageUrl);
            const postWithObjectId = {
                ...postData,
                author: new mongodb_1.ObjectId(author._id),
                createdAt: new Date(),
                updatedAt: new Date(),
                imagePath: file ? file.originalname : "",
                imageUrl: imageUrl,
            };
            console.log("postData before saving adentro:", postWithObjectId);
            await PostModel.collection.insertOne(postWithObjectId);
        }
        catch (err) {
            console.error("Error creating post", err);
        }
    }
    static async getAllPosts() {
        try {
            if (!PostModel.collection) {
                throw new Error("Collection isn't initialized");
            }
            const posts = await PostModel.collection
                .find({})
                .sort({ createdAt: -1 })
                .toArray();
            return posts;
        }
        catch (error) {
            console.error("Error getting all posts", error);
        }
        return [];
    }
    static async getPostById(id) {
        try {
            if (!PostModel.collection) {
                throw new Error("Post collection not initialized");
            }
            const post = await PostModel.collection.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            return post;
            console.log("aqui la busqueda", post);
        }
        catch (error) {
            console.error("Error getting post by id", error);
        }
        return null;
    }
    static async updatePost(id, postData, options, file) {
        try {
            if (!PostModel.collection) {
                throw new Error("Post collection not initialized");
            }
            let imageUrl;
            if (file) {
                const buffer = file.buffer;
                const publicId = file.originalname.replace(/\.[^/.]+$/, "");
                try {
                    const result = await (0, uploadCloudinary_1.uploadImage)(buffer, publicId);
                    imageUrl = result.imageUrl;
                }
                catch (error) {
                    console.error('Error uploading image:', error);
                    imageUrl = "";
                }
            }
            console.log("Model - imageUrl after uploadImage:", imageUrl);
            await PostModel.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                $set: {
                    ...postData,
                    imageUrl: imageUrl
                }
            }, options);
        }
        catch (error) {
            console.error("Error updating post", error);
        }
    }
    static async updateCommentLikes(postId) {
        if (!PostModel.collection) {
            throw new Error("Post collection not initialized");
        }
        // Convierte postId a ObjectId
        const postObjectId = new mongodb_1.ObjectId(postId);
        const post = await PostModel.collection.findOne({ _id: postObjectId });
        if (!post) {
            throw new Error("Post not found");
        }
        const commentUpdates = post.comments.map(comment => {
            if (comment.post === postId) {
                return {
                    updateOne: {
                        filter: { _id: postObjectId, "comments.post": comment.post },
                        update: { $inc: { "comments.$.commentLikes": 1 } }
                    }
                };
            }
            return null;
        }).filter(update => update !== null);
        if (commentUpdates.length > 0) {
            await PostModel.collection.bulkWrite(commentUpdates);
        }
        else {
            throw new Error("No matching comment found for the post");
        }
        // Actualiza el número de likes del comentario
        await PostModel.collection.updateOne({ _id: postObjectId, "comments.post": new mongodb_1.ObjectId(postId) }, { $inc: { "comments.$.commentLikes": 1 } });
    }
    static async addCommentToPost(postId, comment) {
        try {
            if (!PostModel.collection) {
                throw new Error("Post collection not initialized");
            }
            await PostModel.collection.updateOne({ _id: new mongodb_1.ObjectId(postId) }, { $push: { comments: comment } });
        }
        catch (error) {
            console.error("Error adding comment to post", error);
        }
    }
    static async deletePost(id) {
        try {
            if (!PostModel.collection) {
                throw new Error("Post collection not initialized");
            }
            await PostModel.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
        }
        catch (error) {
            console.error("Error deleting post", error);
        }
    }
    static async getPostsByAuthorId(authorId) {
        try {
            if (!PostModel.collection) {
                throw new Error("Post collection not initialized");
            }
            const objectId = new mongodb_1.ObjectId(authorId);
            const posts = await PostModel.collection
                .find({ author: objectId })
                .sort({ createdAt: -1 })
                .toArray();
            const postsWithAuthors = await Promise.all(posts.map(async (post) => {
                const author = await Author_1.AuthorModel.getAuthorById(post.author.toString());
                return {
                    ...post,
                    authorData: author
                        ? {
                            name: author.name,
                            email: author.email,
                            avatarImage: author.avatarImage ?? "",
                        }
                        : null,
                };
            }));
            return postsWithAuthors;
        }
        catch (error) {
            console.error("Error getting all posts with authors", error);
            return [];
        }
    }
    static async getAllPostsWithAuthors() {
        try {
            if (!PostModel.collection) {
                throw new Error("Post collection not initialized");
            }
            const posts = await PostModel.collection
                .find({})
                .sort({ createdAt: -1 })
                .toArray();
            const postsWithAuthors = await Promise.all(posts.map(async (post) => {
                const author = await Author_1.AuthorModel.getAuthorById(post.author.toString());
                return {
                    ...post,
                    authorData: author
                        ? {
                            name: author.name,
                            email: author.email,
                            avatarImage: author.avatarImage ?? "",
                        }
                        : null,
                };
            }));
            return postsWithAuthors;
        }
        catch (err) {
            console.log("error", err);
            return [];
        }
    }
    static async getCommentsByPostId(postId) {
        try {
            const post = await PostModel.getPostById(postId);
            if (!post) {
                throw new Error('Post no encontrado');
            }
            const comments = await Comment_1.CommentModel.findComments({ post: postId });
            return comments;
        }
        catch (error) {
            console.error('Error obteniendo comentarios:', error);
            return [];
        }
    }
}
exports.PostModel = PostModel;
PostModel.collection = null;
