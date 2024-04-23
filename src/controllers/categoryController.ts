import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
export class CategoryController {
static async createCategory(req: Request, res: Response): Promise<void> {
    try {
        const categoryData = req.body;
        await CategoryModel.createCategory(categoryData);
        res.status(200).json({ message: "Category created successfully" });
    } catch (error) {
        console.error('Error creating category',error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const categoryData = req.body;
        await CategoryModel.updateCategory(id, categoryData);
        res.status(200).json({message:"Category updated Successfully!"});
    } catch (error) {
        console.error('Error updating category',error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        await CategoryModel.deleteCategory(id);
        res.status(200).json({message:'Category deleted successfully!'})
    } catch (error) {
        console.error('Error deleting category',error)
        res.status(400).json({error:'Bad request.'});
    }
};
static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
        const  { id } = req.params;
        const category = await CategoryModel.getCategoryById(id);
      res.status(200).json(category);
    } catch (error) {
        console.error('Error getting category by Id',error);
        res.status(400).json({error:'Bad request.'});
    }
};
static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
        const categories = await CategoryModel.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error getting all categories',error);
        res.status(500).json({ error: 'Server Error' });
    }
}

}