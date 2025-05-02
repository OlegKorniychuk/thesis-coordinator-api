import {DiplomaCyclePhase} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import diplomaCycleService from 'services/diplomaCycle/diplomaCycle.service';

const diplomaCyclePhaseMap = {
  [DiplomaCyclePhase.preparation]: 'Підготування',
  [DiplomaCyclePhase.supervisor_selection]: 'Обирання Керівників',
  [DiplomaCyclePhase.topic_selection]: 'Обирання Тем',
  [DiplomaCyclePhase.post_cycle]: 'Завершення'
};

// Leave phases empty to only check for active diploma cycle
const restrictToPhases = (phases: DiplomaCyclePhase[] | null = null) =>
  catchError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentDiplomaCycle = await diplomaCycleService.getCurrentDiplomaCycle();

    if (!currentDiplomaCycle) return next(new AppError('Дипломний цикл не розпочато!', 400));
    if (phases && !phases.includes(currentDiplomaCycle.current_phase)) {
      const mappedPhases = phases.map(phase => diplomaCyclePhaseMap[phase]).join(', ');
      return next(new AppError(`Цю дію можна виконати тільки в такі етапи: ${mappedPhases}`, 400));
    }

    req['currentDiplomaCycle'] = currentDiplomaCycle;
    next();
  });

export {restrictToPhases};
