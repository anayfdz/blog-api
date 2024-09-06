"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const commentRoutes = express_1.default.Router();
exports.commentRoutes = commentRoutes;
commentRoutes.post('/', commentController_1.CommentController.createComment);
commentRoutes.put('/:id', commentController_1.CommentController.updateComment);
commentRoutes.delete('/:id', commentController_1.CommentController.deleteComment);
commentRoutes.get('/:id', commentController_1.CommentController.getCommentById);
commentRoutes.get('/', commentController_1.CommentController.getAllComments);
commentRoutes.post('/like', commentController_1.CommentController.likeComment);
