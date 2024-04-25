import express, { Request, Response } from 'express';
import { TagController } from '../controllers/tagController';

const tagRoutes = express.Router();

tagRoutes.get('/',TagController.getAllTags);
tagRoutes.post("/",TagController.createTag);

export { tagRoutes};