"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userRoutes = express_1.default.Router();
exports.userRoutes = userRoutes;
userRoutes.post('/users', userController_1.UserController.registerUser);
userRoutes.put('/users/:id', userController_1.UserController.updateUser);
userRoutes.delete('/users/:id', userController_1.UserController.deleteUser);
userRoutes.get('/users/:id', userController_1.UserController.getUserById);
userRoutes.get('/users', userController_1.UserController.getAllUsers);
