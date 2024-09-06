"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
class CategoryModel {
    static async init() {
        const db = await (0, db_1.connectDB)();
        CategoryModel.collection = db.collection("categories");
    }
    static async createCategory(category) {
        if (!CategoryModel.collection) {
            throw new Error("Category collection not initialized");
        }
        await CategoryModel.collection.insertOne({
            ...category,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }
    ;
    static async updateCategory(id, categoryData) {
        if (!CategoryModel.collection) {
            throw new Error("Category collection not initialized");
        }
        await CategoryModel.collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...categoryData, updated_at: new Date() } });
    }
    ;
    static async deleteCategory(id) {
        if (!CategoryModel.collection) {
            throw new Error("Category collection not initialized");
        }
        await CategoryModel.collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
    }
    ;
    static async getCategoryById(id) {
        if (!CategoryModel.collection) {
            throw new Error("Category collection not initialized");
        }
        return await CategoryModel.collection.findOne({ _id: new mongodb_1.ObjectId(id) });
    }
    ;
    static async getAllCategories() {
        if (!CategoryModel.collection) {
            throw new Error("Category collection not initialized");
        }
        return await CategoryModel.collection.find({}).toArray();
    }
    ;
}
exports.CategoryModel = CategoryModel;
CategoryModel.collection = null;
