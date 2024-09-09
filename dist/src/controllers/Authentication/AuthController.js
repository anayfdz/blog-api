"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "";
class AuthController {
    static async register(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        try {
            // verify user exists?
            const existUser = await User_1.UserModel.findUserByEmail(email);
            if (existUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }
            // hash password
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            // create new User
            const newUser = {
                email,
                password: hashedPassword,
                userType: User_1.UserType.USER,
                enabled: true,
                isActive: true,
                verification: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await User_1.UserModel.createUser(newUser);
            res.status(201).json({ message: 'User registered successfully' });
        }
        catch (err) {
            console.error('Error during registration', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Unauthorized" });
            return;
        }
        try {
            const user = await User_1.UserModel.findUserByEmail(email);
            if (!user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const match = await bcrypt_1.default.compare(password, user.password);
            if (!match) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: "72h" });
            res.status(200).json({ token });
        }
        catch (err) {
            console.error("Error during authentication", err);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.AuthController = AuthController;
