import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();
router.post('/register', UserController.registerUser);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);
router.get('/:userId', UserController.getUserById);
router.get('/', UserController.getAllUsers);

export default router;