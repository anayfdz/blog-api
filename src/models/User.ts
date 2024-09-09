import { Collection, ObjectId, Db } from 'mongodb';
import { connectDB } from '../config/db'
interface User {
    _id?: ObjectId;
    email: string;
    password: string;
    userType: UserType;
    enabled: boolean;
    isActive: boolean;
    verification: number;
    author?: ObjectId;
    authorities?: ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export enum UserType {
    ADMIN = 'ADMIN',
    AUTHOR = 'AUTHOR',
    USER = 'USER'
}

export class UserModel {
    private static collection: Collection<User> | null = null;
    static async init() {
        const db: Db = await connectDB();
        UserModel.collection = db.collection<User>('users');
    }

    static async createUser(user: User) {
        if(!UserModel.collection) {
            throw new Error('User collection not initialized');
        }
        const result = await UserModel.collection.insertOne({
            ...user,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return result;
    }
    static async updateUser(userId: string, userData: any): Promise<void> {
        try {
            await UserModel.collection?.updateOne({_id: new ObjectId(userId)},{ $set: userData});
        } catch (error) {
            console.error('Error updating user: ', error);
        }
    }
    static async deleteUser(userId: string): Promise<void> {
        try {
            await UserModel.collection?.deleteOne({_id: new ObjectId(userId)})
        } catch (error) {
            console.error('Error deleting user: ', error);
        }
    }
    static async getUserById(userId: string): Promise<any> {
        try {
            await UserModel.collection?.findOne({_id: new ObjectId(userId)})
        } catch (error) {
            console.error('Error getting user by Id: ', error);
        }
    }
    static async getAllUsers(): Promise<any[]> {
        try {
            if (!UserModel.collection) {
                throw new Error('User collection not initialized');
            }
            const userCollection = UserModel.collection;
            await userCollection.find({}).toArray();
        } catch(error) {
            console.error('Error getting all users: ', error)
        }
        return [];
    }
    static async findUserByEmail(email: string): Promise<User | null> {
        if (!UserModel.collection) {
          throw new Error('User collection not initialized');
        }
        return UserModel.collection.findOne({ email });
      }
}