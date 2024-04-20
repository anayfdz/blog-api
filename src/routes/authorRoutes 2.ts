import express from 'express';
import { AuthorController } from '../controllers/authorController';

const router = express.Router();

router.post('/register', AuthorController.createAuthor);
router.put('/:authorId', AuthorController.updateAuthor);
router.delete('/:authorId', AuthorController.deleteAuthor);
router.get('/:authorId', AuthorController.getAuthorById);
router.get('/', AuthorController.getAllAuthors);

export default router;