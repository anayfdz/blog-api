import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel, UserType } from "../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "";

interface User {
  email: string;
  password: string;
}

export class AuthController {
    static async register(req: Request, res: Response): Promise<void> {
        const {email, password} = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
      }
      try {
        // verify user exists?
        const existUser = await UserModel.findUserByEmail(email);
        if (existUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create new User
        const newUser = {
            email,
            password: hashedPassword,
            userType: UserType.USER,
            enabled: true,
            isActive: true,
            verification: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        await UserModel.createUser(newUser);
        res.status(201).json({message: 'User registered successfully'})
      } catch (err) {
        console.error('Error during registration', err);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Unauthorized" });
      return;
    }
    try {
      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.status(401).json({ message: "Unauthorized" });
          return;
      }

      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "72h" });
      res.status(200).json({ token});
    } catch (err) {
      console.error("Error during authentication", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
 
}
