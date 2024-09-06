"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const categoryRoutes = express_1.default.Router();
exports.categoryRoutes = categoryRoutes;
categoryRoutes.post('/', categoryController_1.CategoryController.createCategory);
categoryRoutes.put('/:id', categoryController_1.CategoryController.updateCategory);
categoryRoutes.delete('/:id', categoryController_1.CategoryController.deleteCategory);
categoryRoutes.get('/:id', categoryController_1.CategoryController.getCategoryById);
categoryRoutes.get('/', categoryController_1.CategoryController.getAllCategories);
