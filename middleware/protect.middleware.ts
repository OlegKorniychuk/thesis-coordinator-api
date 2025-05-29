import {AppError} from '@utils/appError';
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import settings from 'settings';

const protect = (req: Request, res: Response, next: NextFunction): void => {
  const accessToken: string | undefined = req.cookies.accessToken;
  if (!accessToken) return next(new AppError('Вам потрібно авторизуватись!', 401));

  try {
    const userData = jwt.verify(accessToken, settings.accessTokenSecret);
    req['user'] = userData;
    next();
  } catch (err) {
    return next(new AppError('Token invalid', 401));
  }
};

export {protect};
