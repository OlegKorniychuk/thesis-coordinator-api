import {IBachelorFullData} from '@interfaces/bachelorFullData.interface';
import {DiplomaCycle, DiplomaCyclePhase, Prisma} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import archivedBachelorService from 'services/archivedBachelor/archivedBachelor.service';
import {ValidateArchivedBachelorsBatchInput} from 'services/archivedBachelor/archivedBachelor.validate';
import bachelorService from 'services/bachelor/bachelor.service';
import diplomaCycleService from 'services/diplomaCycle/diplomaCycle.service';
import {ValidateCreateDiplomaCycle} from 'services/diplomaCycle/diplomaCycle.validate';
import topicService from 'services/topic/topic.service';

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

const endCurrentCycle = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const currentDiplomaCycle: DiplomaCycle = req['currentDiplomaCycle'];

  const diplomaCycleId = currentDiplomaCycle.diploma_cycle_id;

  const unconfirmedTopicsCount = await topicService.countUnconfirmedTopics(diplomaCycleId);

  if (unconfirmedTopicsCount !== 0)
    return next(
      new AppError(
        `Неможливо завершити дипломний період - є ${unconfirmedTopicsCount} дипломників з незатвердженими темами!`,
        400
      )
    );

  const bachelorsData: IBachelorFullData[] =
    await bachelorService.getBachelorsFullData(diplomaCycleId);
  const archivedBachelors = bachelorsData.map(bachelor => ({
    year: currentDiplomaCycle.year,
    full_name: [
      bachelor.student.last_name,
      bachelor.student.first_name,
      bachelor.student.second_name
    ].join(' '),
    group: bachelor.student.group,
    topic: bachelor.topic?.name,
    specialty: bachelor.student.specialty,
    academic_program: bachelor.student.academic_program,
    supervisor_full_name: [
      bachelor.supervisor?.teacher.last_name,
      bachelor.supervisor?.teacher.first_name,
      bachelor.supervisor?.teacher.second_name
    ].join(' '),
    supervisor_degree: bachelor.supervisor?.teacher.academic_degree,
    supervisor_position: bachelor.supervisor?.teacher.position
  }));

  const validationRes = ValidateArchivedBachelorsBatchInput.safeParse(archivedBachelors);
  if (validationRes.error)
    return next(
      new AppError(
        'Цілісність даних системи порушено - є активні дипломники без керівника або теми!',
        500
      )
    );

  await archivedBachelorService.createArchivedBachelors(validationRes.data);
  await diplomaCycleService.deleteDiplomaCycle(diplomaCycleId);

  res.status(204).json({});
});

const getCurrentCycle = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const diplomaCycle: DiplomaCycle | null = await diplomaCycleService.getCurrentDiplomaCycle();

    res.status(200).json({
      status: 'success',
      data: {
        diplomaCycle
      }
    });
  }
);

export {startNewCycle, endCurrentCycle, getCurrentCycle};
