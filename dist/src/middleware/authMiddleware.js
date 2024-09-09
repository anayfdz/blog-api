"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const user = await verifyToken(token, JWT_SECRET);
            console.log('JWT_SECRET:', JWT_SECRET);
            console.log('Decoded User:', user);
            req.user = user;
            console.log('User attached to request:', req.user);
            next();
        }
        catch (err) {
            console.error('Error verifying token:', err);
            res.sendStatus(403);
        }
    }
    else {
        console.error('No token provided');
        res.sendStatus(401);
    }
};
exports.authenticateJWT = authenticateJWT;
const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            console.log('Token being verified:', token);
            console.log('Using secret:', secret);
            if (err) {
                console.error('Error during token verification:', err.name, '-', err.message);
                reject(err);
            }
            else {
                console.log('Decoded Token:', decoded);
                resolve(decoded);
            }
        });
    });
};
