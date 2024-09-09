"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const Category_1 = require("../models/Category");
class CategoryController {
    static async createCategory(req, res) {
        try {
            const categoryData = req.body;
            await Category_1.CategoryModel.createCategory(categoryData);
            res.status(200).json({ message: "Category created successfully" });
        }
        catch (error) {
            console.error('Error creating category', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
    static async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const categoryData = req.body;
            await Category_1.CategoryModel.updateCategory(id, categoryData);
            res.status(200).json({ message: "Category updated Successfully!" });
        }
        catch (error) {
            console.error('Error updating category', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    ;
    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await Category_1.CategoryModel.deleteCategory(id);
            res.status(200).json({ message: 'Category deleted successfully!' });
        }
        catch (error) {
            console.error('Error deleting category', error);
            res.status(400).json({ error: 'Bad request.' });
        }
    }
    ;
    static async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category_1.CategoryModel.getCategoryById(id);
            res.status(200).json(category);
        }
        catch (error) {
            console.error('Error getting category by Id', error);
            res.status(400).json({ error: 'Bad request.' });
        }
    }
    ;
    static async getAllCategories(req, res) {
        try {
            const categories = await Category_1.CategoryModel.getAllCategories();
            res.status(200).json(categories);
        }
        catch (error) {
            console.error('Error getting all categories', error);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
exports.CategoryController = CategoryController;
