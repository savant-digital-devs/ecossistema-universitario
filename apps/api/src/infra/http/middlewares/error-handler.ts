import type { Request, Response, NextFunction } from 'express';
import { ResourceNotFoundError } from '../../../core/errors/resource-not-found-error';
import { InvalidStateTransitionError } from '../../../core/errors/invalid-state-transition-error';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ResourceNotFoundError) {
    return res.status(404).json({ message: err.message });
  }

  if (err instanceof InvalidStateTransitionError) {
    return res.status(409).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}