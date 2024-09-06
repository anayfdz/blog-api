"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../controllers/Authentication/AuthController");
const authRoutes = express_1.default.Router();
authRoutes.post('/login', AuthController_1.AuthController.login);
authRoutes.post('/register', AuthController_1.AuthController.register);
exports.default = authRoutes;
