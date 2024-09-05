import express from 'express';
import { AuthorController } from '../controllers/authorController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const authorRoutes  = express.Router();

authorRoutes .post('/', authenticateJWT,upload.single('avatarImage'), AuthorController.createAuthor);
authorRoutes .put('/:id', AuthorController.updateAuthor);
authorRoutes .delete('/:id', AuthorController.deleteAuthor);
authorRoutes .get('/:id', AuthorController.getAuthorById);
authorRoutes .get('/', AuthorController.getAllAuthors);

export { authorRoutes } ;