import express from 'express';
import { CategoryController } from '../controllers/categoryController';

const categoryRoutes = express.Router();
categoryRoutes.post('/',CategoryController.createCategory);
categoryRoutes.put('/:id',CategoryController.updateCategory);
categoryRoutes.delete('/:id', CategoryController.deleteCategory);
categoryRoutes.get('/:id', CategoryController.getCategoryById);
categoryRoutes.get('/', CategoryController.getAllCategories)

export {categoryRoutes};