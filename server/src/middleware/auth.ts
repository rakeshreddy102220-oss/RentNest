import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const SECRET = process.env.JWT_SECRET || 'rentnest-secret';

export interface AuthRequest extends Request {
  user?: { id: number; role: string; name: string; email: string; phone_number?: string | null; profile_image?: string | null; verification_status?: number };
}

export function authMiddleware(requiredRole?: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, SECRET) as {
        id: number;
        role: string;
        name: string;
        email: string;
        phone_number?: string | null;
        profile_image?: string | null;
        verification_status?: number;
      };
      const user = await db.get(
        'SELECT id, name, email, role, phone_number, profile_image, verification_status FROM users WHERE id = ?',
        payload.id
      );
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
