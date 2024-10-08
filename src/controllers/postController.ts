import { Request, Response } from "express";
import { PostModel } from "../models/Post";
import { AuthorModel } from "../models/Author";
import { AuthenticatedRequest } from "../types/types";
import { ObjectId } from "mongodb";
import { uploadImage } from "../config/uploadCloudinary";
export class PostController {
  static async createPost(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
        const { title, content, categories, tags } = req.body;
        const file = req.file
        if (!title || !content) {
            res.status(400).json({ message: "Title and content are required" });
            return;
        }
        const authorEmail = req.user?.email;
        if (!authorEmail) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const authorData = await AuthorModel.getAuthorByEmail(authorEmail);
        if (!authorData) {
            res.status(404).json({ message: "Author not found" });
            return;
        }
        const authorId = new ObjectId(authorData._id);
        
        let imageUrl: string | undefined;
        if (file) {
          const buffer = file.buffer;
          const publicId = file.originalname.replace(/\.[^/.]+$/, "");
          try {
            const result = await uploadImage(buffer, publicId);
            console.log("Resultado de imagen:", result);
            imageUrl = result.imageUrl;
            console.log("Resultado de imagen 2:", imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            //imageUrl = "";
        }
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
        imagePath: file ? file.originalname : "",
        imageUrl,
      };
      console.log("postData before saving controller:", postData);

      await PostModel.createPost(postData, authorData, file);
      res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
      console.error("Error creating post", error);
      res.status(500).json({ message: "Error creating post" });
    }
  }
  static async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await PostModel.getAllPostsWithAuthors();
      res
        .status(200)
        .json({ message: "Successfully retrieved all posts", data: posts });
    } catch (error) {
      console.error("Error getting all posts", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log("aqui el controller", id);
      const post = await PostModel.getPostById(id);
      if (post) {
        res.status(200).json({ data: post });
      } else {
        res.status(404).json({ message: "Post no encontrado" });
      }
    } catch (error) {
      console.error("Error getting post by id", error);
      res.status(500).json("Internal server error");
    }
  }
  static async updatePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const postData = req.body;
      const file = req.file;
      let imageUrl: string | undefined;
      if (file) {
        console.log("File buffer:", file.buffer); 
        const buffer = file.buffer;
        const publicId = file.originalname.replace(/\.[^/.]+$/, "");
        try {
          const result = await uploadImage(buffer, publicId);
          imageUrl = result.imageUrl;
      } catch (error) {
          console.error('Error uploading image:', error);
          imageUrl = "";
      }
      }
      await PostModel.updatePost(id, { ...postData, imageUrl });
      res
        .status(200)
        .json({ message: "Se ha actualizado el post correctamente" });
    } catch (error) {
      console.error("Error updating post", error);
      res.status(500).json("Server Error");
    }
  }
  static async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PostModel.deletePost(id);
      res.status(200).json({ message: "Post eliminado con exito" });
    } catch (error) {
      console.error("Error deleting post", error);
      res.status(500).json("Server Error");
    }
  }
  static async getAllPostsWithAuthors(req: Request, res: Response) {
    try {
      const posts = await PostModel.getAllPosts();
      const postsWithAuthors = [];
      for (const post of posts) {
        const author = await AuthorModel.getAuthorById(post.author.toString());
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
    } catch (error) {
      console.error("Error fetching posts with authors:", error);
      res.status(500).json({ message: "Error fetching posts with authors" });
    }
  }
  static async getAllPostWithComments(req: Request, res: Response) {
    try {
      if (!req.params.id || typeof req.params.id !== "string") {
        res.status(400).json({ message: "Invalid post id" });
        return;
      }
      const postId = req.params.id;
      const posts = await PostModel.getCommentsByPostId(postId);
      res
        .status(200)
        .json({ message: "Successfully retrieved all posts", data: posts });
    } catch (error) {
      console.error("Error getting all posts", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
