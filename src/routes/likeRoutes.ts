import express from 'express';
import { LikeController } from '../controllers/likeController';

const likeRoutes = express.Router();
likeRoutes.post('/', LikeController.likeContent);
likeRoutes.delete('/:id', LikeController.unlikeContent);

export {likeRoutes};