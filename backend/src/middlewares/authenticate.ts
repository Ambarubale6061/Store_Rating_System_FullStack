import { NextFunction, Response } from 'express';
import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';
import { AuthRequest } from '../types/auth-request';

/**
 * Verifies the Bearer access token on the Authorization header and attaches
 * a minimal, trusted `req.user` object for downstream handlers/middleware.
 */
export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Authentication token is missing.'));
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    next(AppError.unauthorized('Invalid or expired authentication token.'));
  }
}