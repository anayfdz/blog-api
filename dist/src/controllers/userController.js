"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
class UserController {
    static async registerUser(req, res) {
        try {
            const userData = req.body;
            await User_1.UserModel.createUser(userData);
            res.status(200).json({ message: 'Usuario registrado con exito' });
        }
        catch (error) {
            console.error('Error registrando al usuario:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async updateUser(req, res) {
        const { id } = req.params;
        const userData = req.body;
        try {
            await User_1.UserModel.updateUser(id, userData);
            res.status(200).json({ message: 'User updated successfully' });
        }
        catch (error) {
            console.error('Error updating user', error);
            res.status(500).json({ message: 'Error updating user' });
        }
    }
    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await User_1.UserModel.deleteUser(id);
            res.status(200).json({ message: 'User deleting successfully' });
        }
        catch (error) {
            console.error('Error deleting: ', error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    }
    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User_1.UserModel.getUserById(id);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            console.error('Error getting user By Id', error);
            res.status(500).json({ message: 'Error getting user by Id' });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await User_1.UserModel.getAllUsers();
            res.status(200).json(users);
        }
        catch (error) {
            console.error('Error getting all users: ', error);
            res.status(500).json({ message: 'Error getting all users' });
        }
    }
}
exports.UserController = UserController;
