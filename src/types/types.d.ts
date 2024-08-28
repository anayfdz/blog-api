import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    iat: number;
    email: string;
  };
}
