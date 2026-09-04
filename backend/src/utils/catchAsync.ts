import { NextFunction, Request, Response } from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Wraps async Express handlers so rejected promises are forwarded to
 * the global error handler instead of crashing the process.
 */
export const catchAsync =
  (fn: AsyncController) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
