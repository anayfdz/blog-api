import { Request } from 'express';
import { Multer } from 'multer';
export interface AuthenticatedRequest extends Request {
  user?: {
    iat: number;
    email: string;
  };
  file?: Express.Multer.File;
}
