import { Request, Response } from "express";
import { RoleModel } from "../models/Role";

export class RoleController {
  static async createRole(req: Request, res: Response): Promise<void> {
    try {
      const roleData = req.body;
      await RoleModel.createRole(roleData);
      res.status(200).json({ message: "Successfully created new role" });
    } catch (err) {
      console.error("Error creating role", err);
    }
  }
  static async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await RoleModel.getAllRoles();
      res.status(200).json(roles);
    } catch (err) {
      console.error("Error getting all roles", err);
      res.status(404).json({ message: "No Roles Found" });
    }
  }
  static async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleId = await RoleModel.getRoleById(id);
      res.status(200).json(roleId);
    } catch (err) {
      console.error("Error getting role by id", err);
      res.status(500).json({ message: "Failed" });
    }
  }
  static async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const roleData = req.body;
      await RoleModel.updateRole(id, roleData);
      res.status(200).json({ message: "Updated Success" });
    } catch (err) {
      console.error("Error updating role", err);
      res.status(404).json({ message: "Update Failed" });
    }
  }
  static async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await RoleModel.deleteRole(id);
      res.status(200).send("Deleted Successfully");
    } catch (err) {
      console.error("Error deleting role", err);
      res.status(500).json({ message: "Delete failed" });
    }
  }
}
