"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tagController_1 = require("../controllers/tagController");
const tagRoutes = express_1.default.Router();
exports.tagRoutes = tagRoutes;
tagRoutes.get('/', tagController_1.TagController.getAllTags);
tagRoutes.post("/", tagController_1.TagController.createTag);
