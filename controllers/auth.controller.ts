import {User} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import authService from 'services/auth/auth.service';
import {ValidateLogIn} from 'services/auth/auth.validate';

const logIn = catchError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {login, password} = ValidateLogIn.parse(req.body);
  const user: User | null = await authService.logIn(login, password);

  if (!user) return next(new AppError('Невірний логін або пароль!', 401));

  const tokens = await authService.generateTokens(user.user_id, user.role);

  res.status(200).json({
    status: 'success',
    data: tokens
  });
});

export {logIn};
