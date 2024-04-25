import { Collection, ObjectId } from "mongodb";
import { connectDB } from "../config/db";

interface Role {
  _id?: ObjectId;
  authority: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RoleModel {
  private static collection: Collection<Role> | null = null;
  static async init() {
    const db = await connectDB();
    RoleModel.collection = db.collection("roles");
  }
  static async createRole(role: Role): Promise<void> {
    if (!RoleModel.collection) {
      throw new Error("Role collection not initialized");
    }
    await RoleModel.collection.insertOne({
      ...role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  static async getAllRoles(): Promise<Role[]> {
    if (!RoleModel.collection) {
      throw new Error("Role collection not initialized");
    }
    return RoleModel.collection.find({}).toArray();
  }
  static async getRoleById(id: string): Promise<Role | null> {
    if (!RoleModel.collection) {
      throw new Error("Role collection not initialized");
    }
    return RoleModel.collection.findOne({ _id: new ObjectId(id) });
  }
  static async updateRole(id: string, roleData: Partial<Role>): Promise<void> {
    if (!RoleModel.collection) {
      throw new Error("Role collection not initialized");
    }
    await RoleModel.collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      { $set: { ...roleData, updatedAt: new Date() } }
    );
  };

  static async deleteRole(id: string): Promise<void> {
    if (!RoleModel.collection) {
        throw new Error('Role collection not initialized');
      }
      await RoleModel.collection.deleteOne({ _id: new ObjectId(id)})
  }
}
