import { ObjectId, Collection, Db, BulkWriteResult } from "mongodb";
import { connectDB } from "../config/db";
import { Author, AuthorModel } from "./Author";
import { CommentModel } from "./Comment";
import { uploadImage } from '../config/uploadCloudinary'
interface Post {
  _id?: ObjectId;
  title: string;
  content: string;
  categories?: string[];
  tags?: string[];
  comments: Comment[];
  imagePath?: string;
  imageUrl?: string;
  author: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  post: string;
  content: string;
  commentLikes: number;
  createdAt: Date;
  updatedAt: Date;
}
interface PostWithAuthor extends Post {
  authorData: {
    name: string;
    avatarImage: string;
    email: string | undefined;
  } | null;
}
export class PostModel {
  private static collection: Collection<Post> | null = null;
  static async init() {
    const db = await connectDB();
    PostModel.collection = db.collection("posts");
  }
  static getCollection() {
    if (!PostModel.collection) {
      throw new Error("No post collection");
    }
    return PostModel.collection;
  }
  static async createPost(
    postData: Omit<Post, "_id" | "createdAt" | "updatedAt">,
    author: Author,
    imagePath?: string
  ): Promise<void> {
    try {
      if (!PostModel.collection) {
        throw new Error("Collection is not inited");
      }
      if (!author) {
        throw new Error("Author ID is required");
      }
      let imageUrl: string | undefined;
      if(imagePath != null && imagePath !== undefined) {
        console.log("URL after uploadImage in createPost:", imagePath);
        try{
          imageUrl = await uploadImage(imagePath);
          console.log("URL after uploadImage in createPost:", imageUrl);
        } catch(error) {
          console.log("Error uploading image", error);
        }
      }
      console.log("Model - imagePath:", imagePath);
        console.log("Model - imageUrl after uploadImage:", imageUrl);
      const postWithObjectId = {
        ...postData,
        author: new ObjectId(author._id),
        createdAt: new Date(),
        updatedAt: new Date(),
        imagePath,
        imageUrl: imageUrl ? imageUrl : '',
      };
      await PostModel.collection.insertOne(postWithObjectId);
    } catch (err) {
      console.error("Error creating post", err);
    }
  }

  static async getAllPosts(): Promise<Post[]> {
    try {
      if (!PostModel.collection) {
        throw new Error("Collection isn't initialized");
      }
      const posts = await PostModel.collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return posts;
    } catch (error) {
      console.error("Error getting all posts", error);
    }
    return [];
  }
  static async getPostById(id: string): Promise<Post | null> {
    try {
      if (!PostModel.collection) {
        throw new Error("Post collection not initialized");
      }
      const post = await PostModel.collection.findOne({
        _id: new ObjectId(id),
      });
      return post;
      console.log("aqui la busqueda", post);
    } catch (error) {
      console.error("Error getting post by id", error);
    }
    return null;
  }
  static async updatePost(
    id: string,
    postData: Partial<Post>,
    options?: any,
    imagePath?: string
  ): Promise<void> {
    try {
      if (!PostModel.collection) {
        throw new Error("Post collection not initialized");
      }
      let imageUrl: string | undefined;
      if (imagePath) {
        imageUrl = await uploadImage(imagePath);
      }
      await PostModel.collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...postData,
            imageUrl: imageUrl
          } 
        },
        options
      );
    } catch (error) {
      console.error("Error updating post", error);
    }
  }
  static async updateCommentLikes(postId: string): Promise<void> {
    if (!PostModel.collection) {
      throw new Error("Post collection not initialized");
    }
    // Convierte postId a ObjectId
    const postObjectId = new ObjectId(postId);
    const post = await PostModel.collection.findOne({ _id: postObjectId });
    if (!post) {
      throw new Error("Post not found");
    }
    const commentUpdates  = post.comments.map(comment => {
      if(comment.post === postId) {
        return { 
          updateOne: { 
            filter: { _id: postObjectId, "comments.post": comment.post},
            update: { $inc: {"comments.$.commentLikes": 1}}
          }
        }
      }
      return null
    }).filter(update => update !== null);

    if(commentUpdates.length > 0) {
      await PostModel.collection.bulkWrite(commentUpdates)
    } else {
      throw new Error("No matching comment found for the post")
    }
        // Actualiza el número de likes del comentario
        await PostModel.collection.updateOne(
          { _id: postObjectId, "comments.post": new ObjectId(postId) },
          { $inc: { "comments.$.commentLikes": 1 } }
      );
  }

  static async addCommentToPost(postId: string, comment: Comment): Promise<void> {
    try {
      if (!PostModel.collection) {
        throw new Error("Post collection not initialized");
      }

      await PostModel.collection.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: comment } }
      );
    } catch (error) {
      console.error("Error adding comment to post", error);
    }
  }

  
  static async deletePost(id: string): Promise<void> {
    try {
      if (!PostModel.collection) {
        throw new Error("Post collection not initialized");
      }
      await PostModel.collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      console.error("Error deleting post", error);
    }
  }
  static async getPostsByAuthorId(authorId: string): Promise<PostWithAuthor[]> {
    try {
      if (!PostModel.collection) {
        throw new Error("Post collection not initialized");
      }
      const objectId = new ObjectId(authorId);
      const posts = await PostModel.collection
        .find({ author: objectId })
        .sort({ createdAt: -1 })
        .toArray();
      const postsWithAuthors = await Promise.all(
        posts.map(async (post) => {
          const author = await AuthorModel.getAuthorById(
            post.author.toString()
          );
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
        })
      );
      return postsWithAuthors;
    } catch (error) {
      console.error("Error getting all posts with authors", error);
      return [];
    }
  }
  static async getAllPostsWithAuthors(): Promise<PostWithAuthor[]> {
    try {
      if (!PostModel.collection) {
        throw new Error("Post collection not initialized");
      }
      const posts = await PostModel.collection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      const postsWithAuthors = await Promise.all(
        posts.map(async (post) => {
          const author = await AuthorModel.getAuthorById(
            post.author.toString()
          );
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
        })
      );
      return postsWithAuthors;
    } catch (err) {
      console.log("error", err);
      return [];
    }
  }
  static async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      const post = await PostModel.getPostById(postId);
      if (!post) {
        throw new Error('Post no encontrado');
      }
      const comments = await CommentModel.findComments({ post: postId })
      return comments;
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      return []
    }
}
}
