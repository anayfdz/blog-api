import { Collection, ObjectId, Db } from "mongodb";
import { connectDB } from "../config/db";

interface Category {
  _id?: ObjectId;
  title: string;
  slug: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export class CategoryModel {
  private static collection: Collection<Category> | null = null;
  static async init() {
    const db: Db = await connectDB();
    CategoryModel.collection = db.collection<Category>("categories");
  }
  static async createCategory(category: Category): Promise<void> {
    if (!CategoryModel.collection) {
      throw new Error("Category collection not initialized");
    }
    await CategoryModel.collection.insertOne({
      ...category,
      created_at: new Date(),
      updated_at: new Date(),
    });
  };
  static async updateCategory(id: string, categoryData:Partial<Category>): Promise<void> {
    if(!CategoryModel.collection) {
        throw new Error("Category collection not initialized");
    }
    await CategoryModel.collection.updateOne({ _id: new ObjectId(id)}, {$set: {...categoryData, updated_at: new Date()}})
  };
  static async deleteCategory(id: string): Promise<void> {
    if(!CategoryModel.collection) {
        throw new Error("Category collection not initialized");
    }
    await CategoryModel.collection.deleteOne({ _id: new ObjectId(id)})
  };
  static async getCategoryById(id: string): Promise<Category | null> {
    if(!CategoryModel.collection) {
        throw new Error("Category collection not initialized");
    }
    return await CategoryModel.collection.findOne({ _id: new ObjectId(id)});
  };
  static async getAllCategories(): Promise<Category[]> {
    if(!CategoryModel.collection) {
        throw new Error("Category collection not initialized");
    }
    return await CategoryModel.collection.find({}).toArray();
  };
}
