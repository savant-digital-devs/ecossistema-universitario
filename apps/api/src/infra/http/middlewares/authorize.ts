import type { Request, Response, NextFunction } from 'express';

type Role = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.userRole)) {
      res.status(403).json({ message: 'Acesso não autorizado.' });
      return;
    }
    next();
  };
}
