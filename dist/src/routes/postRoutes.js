"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const postRoutes = express_1.default.Router();
exports.postRoutes = postRoutes;
postRoutes.post('/', authMiddleware_1.authenticateJWT, upload_1.upload.single('imageUrl'), postController_1.PostController.createPost);
postRoutes.get('/', postController_1.PostController.getAllPosts);
postRoutes.get('/', postController_1.PostController.getAllPostsWithAuthors);
postRoutes.get('/comments/:id', postController_1.PostController.getAllPostWithComments);
postRoutes.get('/:id', postController_1.PostController.getPostById);
postRoutes.put('/:id', postController_1.PostController.updatePost);
postRoutes.delete('/:id', postController_1.PostController.deletePost);
