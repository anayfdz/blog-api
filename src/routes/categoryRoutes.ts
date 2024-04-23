import express from 'express';
import { CategoryController } from '../controllers/categoryController';

const categoryRoutes = express.Router();
categoryRoutes.post('/categories',CategoryController.createCategory);
categoryRoutes.put('/categories/:id',CategoryController.updateCategory);
categoryRoutes.delete('/categories/:id', CategoryController.deleteCategory);
categoryRoutes.get('/categories/:id', CategoryController.getCategoryById);
categoryRoutes.get('/categories', CategoryController.getAllCategories)

export {categoryRoutes};