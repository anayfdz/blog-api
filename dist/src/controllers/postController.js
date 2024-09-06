"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const Post_1 = require("../models/Post");
const Author_1 = require("../models/Author");
const mongodb_1 = require("mongodb");
const uploadCloudinary_1 = require("../config/uploadCloudinary");
class PostController {
    static async createPost(req, res) {
        try {
            const { title, content, categories, tags } = req.body;
            const imagePath = req.file?.path;
            if (!title || !content) {
                res.status(400).json({ message: "Title and content are required" });
                return;
            }
            const authorEmail = req.user?.email;
            if (!authorEmail) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const authorData = await Author_1.AuthorModel.getAuthorByEmail(authorEmail);
            if (!authorData) {
                res.status(404).json({ message: "Author not found" });
                return;
            }
            const authorId = new mongodb_1.ObjectId(authorData._id);
            // Subir la imagen si existe
            let imageUrl;
            if (imagePath) {
                imageUrl = await (0, uploadCloudinary_1.uploadImage)(imagePath);
            }
            const postData = {
                title,
                content,
                categories: Array.isArray(categories) ? categories : [categories],
                tags: Array.isArray(tags) ? tags : [tags],
                author: authorId,
                createdAt: new Date(),
                updatedAt: new Date(),
                comments: [],
                imagePath,
                imageUrl: imageUrl || "",
            };
            console.log("postData before saving:", postData);
            await Post_1.PostModel.createPost(postData, authorData, imagePath);
            res.status(201).json({ message: "Post created successfully" });
        }
        catch (error) {
            console.error("Error creating post", error);
            res.status(500).json({ message: "Error creating post" });
        }
    }
    static async getAllPosts(req, res) {
        try {
            const posts = await Post_1.PostModel.getAllPostsWithAuthors();
            res
                .status(200)
                .json({ message: "Successfully retrieved all posts", data: posts });
        }
        catch (error) {
            console.error("Error getting all posts", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    static async getPostById(req, res) {
        try {
            const { id } = req.params;
            console.log("aqui el controller", id);
            const post = await Post_1.PostModel.getPostById(id);
            if (post) {
                res.status(200).json({ data: post });
            }
            else {
                res.status(404).json({ message: "Post no encontrado" });
            }
        }
        catch (error) {
            console.error("Error getting post by id", error);
            res.status(500).json("Internal server error");
        }
    }
    static async updatePost(req, res) {
        try {
            const { id } = req.params;
            const postData = req.body;
            await Post_1.PostModel.updatePost(id, postData);
            res
                .status(200)
                .json({ message: "Se ha actualizado el post correctamente" });
        }
        catch (error) {
            console.error("Error updating post", error);
            res.status(500).json("Server Error");
        }
    }
    static async deletePost(req, res) {
        try {
            const { id } = req.params;
            await Post_1.PostModel.deletePost(id);
            res.status(200).json({ message: "Post eliminado con exito" });
        }
        catch (error) {
            console.error("Error deleting post", error);
            res.status(500).json("Server Error");
        }
    }
    static async getAllPostsWithAuthors(req, res) {
        try {
            const posts = await Post_1.PostModel.getAllPosts();
            const postsWithAuthors = [];
            for (const post of posts) {
                const author = await Author_1.AuthorModel.getAuthorById(post.author.toString());
                postsWithAuthors.push({
                    ...post,
                    author: {
                        name: author?.name,
                        avatarImage: author?.avatarImage,
                        description: author?.description,
                    },
                });
            }
            console.log("aqui los post con author", postsWithAuthors);
            res.status(200).json(postsWithAuthors);
        }
        catch (error) {
            console.error("Error fetching posts with authors:", error);
            res.status(500).json({ message: "Error fetching posts with authors" });
        }
    }
    static async getAllPostWithComments(req, res) {
        try {
            if (!req.params.id || typeof req.params.id !== "string") {
                res.status(400).json({ message: "Invalid post id" });
                return;
            }
            const postId = req.params.id;
            const posts = await Post_1.PostModel.getCommentsByPostId(postId);
            res
                .status(200)
                .json({ message: "Successfully retrieved all posts", data: posts });
        }
        catch (error) {
            console.error("Error getting all posts", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.PostController = PostController;
