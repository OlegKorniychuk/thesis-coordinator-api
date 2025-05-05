import {SafeUser} from '@interfaces/safeUser.interface';
import {User} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import authService from 'services/auth/auth.service';
import {ValidateLogIn} from 'services/auth/auth.validate';
import jwt from 'jsonwebtoken';
import settings from 'settings';
import {IUserPayload} from '@interfaces/userPayload.interface';

const logIn = catchError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {login, password} = ValidateLogIn.parse(req.body);
  const user: SafeUser | null = await authService.logIn(login, password);

  if (!user) return next(new AppError('Невірний логін або пароль!', 401));

  const accessToken = await authService.generateAccessToken(user.user_id, user.role);
  const refreshToken = await authService.generateRefreshToken(user.user_id, user.role);

  res.cookie('accessToken', accessToken, {
    secure: true,
    httpOnly: false,
    sameSite: 'strict'
  });
  res.cookie('refreshToken', refreshToken, {
    secure: true,
    httpOnly: false,
    sameSite: 'strict'
  });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

const refreshAccessToken = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return next(new AppError('Refresh token missing!', 400));

  try {
    const refreshPayload = jwt.verify(refreshToken, settings.refreshTokenSecret) as IUserPayload;
    const newAccessToken = authService.generateAccessToken(
      refreshPayload.user_id,
      refreshPayload.role
    );
    res.cookie('accessToken', newAccessToken, {
      secure: true,
      httpOnly: false,
      sameSite: 'strict'
    });

    res.status(204).json({});
  } catch (err) {
    res.clearCookie('refreshToken');
    console.log(refreshToken);
    if (err.name === 'TokenExpiredError') {
      await authService.invalidateRefreshToken(refreshToken);
      return next(new AppError('Термін дії вашої сесії сплив, потрібно авторизуватися.', 401));
    }
    if (err.name === 'JsonWebTokenError') return next(new AppError('Refresh token invalid!', 401));

    throw err;
  }
});

const logout = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return next(new AppError('Refresh token missing!', 400));

    await authService.invalidateRefreshToken(refreshToken);
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.status(204).json({});
  }
);

export {logIn, refreshAccessToken, logout};
