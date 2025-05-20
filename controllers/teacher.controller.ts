import {Teacher} from '@prisma/client';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import teacherService from 'services/teacher/teacher.service';
import {ValidateCreateTeacher} from 'services/teacher/teacher.validate';

const createTeacher = catchError(
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
    const teachers = await teacherService.getPaginatedTeachers(
      parseInt(page as string),
      parseInt(resultsPerPage as string)
    );

    const total = await teacherService.getTeachersCount();

    res.status(200).json({
      status: 'success',
      data: {
        total,
        teachers
      }
    });
  }
);

export {createTeacher, getTeachers};
