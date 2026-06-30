import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';

interface TokenPayload {
  sub: string;
  role: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
}

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userRole: 'ADMIN' | 'PROFESSOR' | 'STUDENT';
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}
