import {Teacher} from '@prisma/client';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import teacherService from 'services/teacher/teacher.service';
import {ValidateCreateTeacher} from 'services/teacher/teacher.validate';

const addTeacher = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = ValidateCreateTeacher.parse(req.body);
    const newTeacher: Teacher = await teacherService.createTeacher(data);

    res.status(200).json({
      status: 'success',
      data: {
        newTeacher
      }
    });
  }
);

const getTeachers = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {page, resultsPerPage} = req.query;
    let skip: number = 0;
    let take: number = 10;
    if (page && resultsPerPage) {
      const intPage = parseInt(page as string);
      const intResultsPerPage = parseInt(resultsPerPage as string);
      skip = intResultsPerPage * (intPage - 1);
      take = intResultsPerPage;
    }
    const teachers = await teacherService.getManyTeachers({skip, take});

    res.status(200).json({
      status: 'success',
      data: {
        teachers
      }
    });
  }
);

export {addTeacher, getTeachers};
