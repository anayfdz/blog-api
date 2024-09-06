"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const likeController_1 = require("../controllers/likeController");
const likeRoutes = express_1.default.Router();
exports.likeRoutes = likeRoutes;
likeRoutes.post('/', likeController_1.LikeController.likeContent);
likeRoutes.delete('/:id', likeController_1.LikeController.unlikeContent);
