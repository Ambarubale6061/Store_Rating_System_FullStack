import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/AppError';

export function validate(req: Request, _res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: 'path' in e ? (e as { path: string }).path : 'unknown',
      message: e.msg as string,
    }));
    return next(AppError.badRequest('Validation failed', formatted));
  }
  next();
}
