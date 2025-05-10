import {ArchivedBachelor} from '@prisma/client';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import archivedBachelorService from 'services/archivedBachelor/archivedBachelor.service';

const getYears = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const years: {year: number}[] = await archivedBachelorService.getUniqueYears();
    const flatYears: number[] = years.map(obj => obj.year);

    res.status(200).json({
      status: 'success',
      data: {
        years: flatYears
      }
    });
  }
);

const getByYear = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const year: number = parseInt(req.params.year);

    const archivedBachelors: ArchivedBachelor[] =
      await archivedBachelorService.getArchivedBachelorsByYear(year);

    res.status(200).json({
      status: 'success',
      data: {
        archivedBachelors
      }
    });
  }
);

export {getYears, getByYear};
