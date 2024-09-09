import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/types";

const JWT_SECRET = process.env.JWT_SECRET || "";


export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    } catch (err) {
      console.error('Error verifying token:', err);
      res.sendStatus(403);
    }
  } else {
    console.error('No token provided');
    res.sendStatus(401);
  }
};

const verifyToken = (token: string, secret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      console.log('Token being verified:', token);
      console.log('Using secret:', secret);
      if (err) {
        console.error('Error during token verification:', err.name, '-', err.message);
        reject(err);
      } else {
        console.log('Decoded Token:', decoded);
        resolve(decoded);
      }
    });
  });
};