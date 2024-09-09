"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserType = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../config/db");
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "ADMIN";
    UserType["AUTHOR"] = "AUTHOR";
    UserType["USER"] = "USER";
})(UserType || (exports.UserType = UserType = {}));
class UserModel {
    static async init() {
        const db = await (0, db_1.connectDB)();
        UserModel.collection = db.collection('users');
    }
    static async createUser(user) {
        if (!UserModel.collection) {
            throw new Error('User collection not initialized');
        }
        const result = await UserModel.collection.insertOne({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return result;
    }
    static async updateUser(userId, userData) {
        try {
            await UserModel.collection?.updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: userData });
        }
        catch (error) {
            console.error('Error updating user: ', error);
        }
    }
    static async deleteUser(userId) {
        try {
            await UserModel.collection?.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
        }
        catch (error) {
            console.error('Error deleting user: ', error);
        }
    }
    static async getUserById(userId) {
        try {
            await UserModel.collection?.findOne({ _id: new mongodb_1.ObjectId(userId) });
        }
        catch (error) {
            console.error('Error getting user by Id: ', error);
        }
    }
    static async getAllUsers() {
        try {
            if (!UserModel.collection) {
                throw new Error('User collection not initialized');
            }
            const userCollection = UserModel.collection;
            await userCollection.find({}).toArray();
        }
        catch (error) {
            console.error('Error getting all users: ', error);
        }
        return [];
    }
    static async findUserByEmail(email) {
        if (!UserModel.collection) {
            throw new Error('User collection not initialized');
        }
        return UserModel.collection.findOne({ email });
    }
}
exports.UserModel = UserModel;
UserModel.collection = null;
