/**
 * AppError is the single error type thrown deliberately by controllers/services.
 * The global error handler distinguishes these "operational" errors (safe to
 * show to the client) from unexpected programming errors (logged, hidden from client).
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, details);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict(message: string, details?: unknown) {
    return new AppError(message, 409, details);
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 500);
  }
}
