import express from 'express';
import { UserController } from '../controllers/userController';

const userRoutes = express.Router();
userRoutes.post('/users', UserController.registerUser);
userRoutes.put('/users/:id', UserController.updateUser);
userRoutes.delete('/users/:id', UserController.deleteUser);
userRoutes.get('/users/:id', UserController.getUserById);
userRoutes.get('/users', UserController.getAllUsers);

export {userRoutes};