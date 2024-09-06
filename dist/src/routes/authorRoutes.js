"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authorController_1 = require("../controllers/authorController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const authorRoutes = express_1.default.Router();
exports.authorRoutes = authorRoutes;
authorRoutes.post('/', authMiddleware_1.authenticateJWT, upload_1.upload.single('avatarImage'), authorController_1.AuthorController.createAuthor);
authorRoutes.put('/:id', authorController_1.AuthorController.updateAuthor);
authorRoutes.delete('/:id', authorController_1.AuthorController.deleteAuthor);
authorRoutes.get('/:id', authorController_1.AuthorController.getAuthorById);
authorRoutes.get('/', authorController_1.AuthorController.getAllAuthors);
