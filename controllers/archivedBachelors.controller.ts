import {ArchivedBachelor} from '@prisma/client';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import archivedBachelorService from 'services/archivedBachelor/archivedBachelor.service';
import Excel from 'exceljs';

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

const generateReport = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const year: number = parseInt(req.params.year);

    const bachelorsData: ArchivedBachelor[] =
      await archivedBachelorService.getArchivedBachelorsByYear(year);

    const formattedBachelorsData: Omit<ArchivedBachelor, 'year' | 'archived_bachelor_id'>[] =
      bachelorsData.map(({year, archived_bachelor_id, ...rest}) => rest);

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(`Звіт ${year}`);

    worksheet.columns = [
      {header: 'ПІБ студента', key: 'full_name'},
      {header: 'Тема дипломного проєкту', key: 'topic'},
      {header: 'Спеціальність', key: 'specialty'},
      {header: 'Освітня програма', key: 'academic_program'},
      {header: 'Група', key: 'group'},
      {header: 'ПІБ керівника', key: 'supervisor_full_name'},
      {header: 'Вчений ступінь керівника', key: 'supervisor_degree'},
      {header: 'Посада керівника', key: 'supervisor_position'}
    ];

    formattedBachelorsData.forEach(item => worksheet.addRow(item));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename="report.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  }
);

export {getYears, getByYear, generateReport};
