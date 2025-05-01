import {AppError} from '@utils/appError';
import {Request, Response, NextFunction} from 'express';

const checkForBody = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0)
    return next(new AppError('Request body is empty!', 400));
  next();
};

export {checkForBody};
