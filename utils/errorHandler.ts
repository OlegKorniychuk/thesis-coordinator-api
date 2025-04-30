import {Request, Response, NextFunction} from 'express';
import {AppError} from './appError';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    return;
  }
  console.log(err);
  res.status(500).json({
    status: 'error',
    message: 'Server error'
  });
};
