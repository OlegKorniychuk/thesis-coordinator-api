import {SafeUser} from '@interfaces/safeUser.interface';
import {UserRole} from '@prisma/client';
import {AppError} from '@utils/appError';
import {Request, Response, NextFunction} from 'express';

const restrictToRoles =
  (roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const userData: SafeUser = req['user'];

    if (!roles.includes(userData.role))
      return next(new AppError('Ви не маєте довзолу на виконання цієї дії!', 403));

    return next();
  };

export {restrictToRoles};
