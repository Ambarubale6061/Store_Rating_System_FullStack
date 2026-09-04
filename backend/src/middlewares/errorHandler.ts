import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

/**
 * Translates known Prisma error codes into user-safe AppErrors.
 * P2002 = unique constraint violation (duplicate email, duplicate rating, etc.)
 * P2025 = record not found (update/delete on missing row)
 */
function mapPrismaError(err: Prisma.PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'field';
      return AppError.conflict(`A record with this ${target} already exists.`);
    }
    case 'P2025':
      return AppError.notFound('The requested record does not exist.');
    case 'P2003':
      return AppError.badRequest('Invalid reference to a related record.');
    default:
      return AppError.internal('Database error occurred.');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function globalErrorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = mapPrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = AppError.badRequest('Invalid data provided to the database layer.');
  } else if (err instanceof Error && err.name === 'JsonWebTokenError') {
    error = AppError.unauthorized('Invalid authentication token.');
  } else if (err instanceof Error && err.name === 'TokenExpiredError') {
    error = AppError.unauthorized('Authentication token has expired.');
  } else {
    error = AppError.internal();
    // Unexpected/programming error — always log full detail server-side.
    // eslint-disable-next-line no-console
    console.error('UNHANDLED ERROR:', err);
  }

  if (!env.isProduction && !(err instanceof AppError)) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(error.details ? { errors: error.details } : {}),
    ...(!env.isProduction && !(err instanceof AppError) ? { stack: (err as Error).stack } : {}),
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
