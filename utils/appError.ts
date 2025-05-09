export class AppError extends Error {
  public statusCode: number;
  public status: 'fail' | 'error';
  public readonly isOperational = true;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}
