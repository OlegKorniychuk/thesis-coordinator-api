import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import diplomaCycleService from 'services/diplomaCycle/diplomaCycle.service';
import {ValidateCreateDiplomaCycle} from 'services/diplomaCycle/diplomaCycle.validate';

const startNewCycle = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const data = ValidateCreateDiplomaCycle.parse(req.body);
  const currentCycle = await diplomaCycleService.getCurrentDiplomaCycle();

  if (currentCycle) return next(new AppError('Вже існує активний дипломний цикл!', 400));

  const newCycle = await diplomaCycleService.createDiplomaCycle(data);
  res.status(200).json({
    status: 'success',
    data: {
      newCycle
    }
  });
});

export {startNewCycle};
