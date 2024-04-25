import express from 'express';
import { LikeController } from '../controllers/likeController';

const likeRoutes = express.Router();
likeRoutes.post('/like', LikeController.likeContent);
likeRoutes.delete('/like/:id', LikeController.unlikeContent);

export {likeRoutes};