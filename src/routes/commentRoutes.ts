import express from 'express';
import { CommentController } from '../controllers/commentController';

const commentRoutes = express.Router();

commentRoutes.post('/',CommentController.createComment);
commentRoutes.put('/:id',CommentController.updateComment);
commentRoutes.delete('/:id',CommentController.deleteComment);
commentRoutes.get('/:id',CommentController.getCommentById);
commentRoutes.get('/',CommentController.getAllComments);
commentRoutes.post('/like', CommentController.likeComment)

export { commentRoutes};