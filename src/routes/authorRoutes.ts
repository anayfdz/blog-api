import express from 'express';
import { AuthorController } from '../controllers/authorController';
import { authenticateJWT } from '../middleware/authMiddleware';

const authorRoutes  = express.Router();

authorRoutes .post('/', authenticateJWT,  AuthorController.createAuthor);
authorRoutes .put('/:id', AuthorController.updateAuthor);
authorRoutes .delete('/:id', AuthorController.deleteAuthor);
authorRoutes .get('/:id', AuthorController.getAuthorById);
authorRoutes .get('/', AuthorController.getAllAuthors);

export { authorRoutes } ;