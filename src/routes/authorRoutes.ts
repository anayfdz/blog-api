import express from 'express';
import { AuthorController } from '../controllers/authorController';
import { authenticateJWT } from '../middleware/authMiddleware';

const authorRoutes  = express.Router();

authorRoutes .post('/authors', authenticateJWT,  AuthorController.createAuthor);
authorRoutes .put('/authors/:id', AuthorController.updateAuthor);
authorRoutes .delete('/authors/:id', AuthorController.deleteAuthor);
authorRoutes .get('/authors/:id', AuthorController.getAuthorById);
authorRoutes .get('/authors', AuthorController.getAllAuthors);

export { authorRoutes } ;