import express, {Request, Response } from 'express';
import { PostController } from '../controllers/postController';

const postRoutes = express.Router();

postRoutes.post('/',PostController.createPost);
postRoutes.get('/',PostController.getAllPosts);
postRoutes.get('/:id',PostController.getPostById);
postRoutes.put('/:id',PostController.updatePost);
postRoutes.delete('/:id',PostController.deletePost);

export { postRoutes};