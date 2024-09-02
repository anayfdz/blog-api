import express, {Request, Response } from 'express';
import { PostController } from '../controllers/postController';
import {authenticateJWT} from "../middleware/authMiddleware"
const postRoutes = express.Router();

postRoutes.post('/',authenticateJWT,PostController.createPost);
postRoutes.get('/',PostController.getAllPosts);
postRoutes.get('/', PostController.getAllPostsWithAuthors);
postRoutes.get('/:id',PostController.getPostById);
postRoutes.put('/:id',PostController.updatePost);
postRoutes.delete('/:id',PostController.deletePost);

export { postRoutes};