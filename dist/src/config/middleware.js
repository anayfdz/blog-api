"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = void 0;
//import { json, urlencoded } from 'body-parser';
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
//const { json, urlencoded } = pkg;
const applyMiddleware = (app) => {
    // Middleware para parsear el body de las solicitudes
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    // Middleware para permitir solicitudes de otros dominios
    app.use((0, cors_1.default)());
    // Middleware para manejar errores
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
};
exports.applyMiddleware = applyMiddleware;
