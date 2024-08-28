import { connectDB } from "./db";
import { UserModel } from "../models/User";
import { AuthorModel } from "../models/Author";
import { CategoryModel } from "../models/Category";
import { CommentModel } from "../models/Comment";
import { LikeModel } from "../models/LikeCounter";
import { PostModel } from "../models/Post";
import { RoleModel } from "../models/Role";
import { TagModel } from "../models/Tag";

export const initializedDatabase = async (): Promise<void> => {
  try {
    const db = await connectDB();
    console.log("Database connected successfully.");
    await UserModel.init();
    await AuthorModel.init();
    await CategoryModel.init();
    await CommentModel.init();
    await LikeModel.init();
    await PostModel.init();
    await RoleModel.init();
    await TagModel.init();
    console.log("Models initialized successfully.");
  } catch (err) {
    console.error("Error initializing database and models:", err);
    throw err;
  }
};
