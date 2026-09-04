import { NextFunction, Response } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../types/auth-request';

/**
 * Restricts a route to one or more roles. Must run after `authenticate`,
 * which populates `req.user`.
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden('You do not have permission to perform this action.'));
    }
    next();
  };
}