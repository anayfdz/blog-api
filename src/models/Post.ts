import { ObjectId, Collection, Db } from "mongodb";
import { connectDB } from "../config/db";
import { Author, AuthorModel } from "./Author";
interface Post {
  _id?: ObjectId;
  title: string;
  content: string;
  categories?: string[];
  tags?: string[];
  author: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface PostWithAuthor extends Post {
  authorData: { name: string; avatarImage: string; email: string | undefined; } | null
}
export class PostModel {
  private static collection: Collection<Post> | null = null;
  static async init() {
    const db = await connectDB();
    PostModel.collection = db.collection("posts");
  }
  static async createPost(
    postData: Omit<Post, "_id" | "createdAt" | "updatedAt">,
    author: Author
  ): Promise<void> {
    try {
      if (!PostModel.collection) {
        throw new Error("Collection is not inited");
      }
      if (!author) {
        throw new Error("Author ID is required");
      }
      const postWithObjectId = {
        ...postData,
        author: new ObjectId(author._id),
        createdAt: new Date(),
        updatedAt: new Date(),
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
      console.log("aqui la busqueda",post)
    } catch (error) {
      console.error("Error getting post by id", error);
    }
    return null;
  }
  static async updatePost(id: string, postData: Partial<Post>): Promise<void> {
    try {
      if (!PostModel.collection) {
        throw new Error("Post collection not initialized");
      }
      await PostModel.collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: postData }
      );
    } catch (error) {
      console.error("Error updating post", error);
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
              ? { name: author.name, email: author.email, avatarImage: author.avatarImage ?? '' }
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
              ? { name: author.name, email: author.email, avatarImage: author.avatarImage ?? '' }
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
}
