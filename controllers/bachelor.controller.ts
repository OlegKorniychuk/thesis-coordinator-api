import {IBachelorFullData} from '@interfaces/bachelorFullData.interface';
import {DiplomaCycle, UserRole} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import bachelorService from 'services/bachelor/bachelor.service';
import diplomaCycleService from 'services/diplomaCycle/diplomaCycle.service';
import studentService from 'services/student/student.service';
import {ValidateCreateStudent} from 'services/student/student.validate';
import authService from 'services/auth/auth.service';

const createBachelor = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const studentData = ValidateCreateStudent.parse(req.body);
  const currentDiplomaCycle: DiplomaCycle = req['currentDiplomaCycle'];

  const newStudent = await studentService.createStudent(studentData);
  if (!newStudent) return next(new AppError('Помилка при збереженні студента!', 500));

  const newUser = await authService.generateNewUser(
    UserRole.bachelor,
    currentDiplomaCycle.diploma_cycle_id
  );

  const newBachelor = await bachelorService.createBachelor({
    student: {
      connect: {
        student_id: newStudent.student_id
      }
    },
    user: {
      connect: {
        user_id: newUser.user_id
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      newBachelor
    }
  });
});

const getBachelorFullData = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bachelorId: string = req.params.bachelorId;
    const bachelor: IBachelorFullData = await bachelorService.getBachelorsFullDataById(bachelorId);

    res.status(200).json({
      status: 'success',
      data: {
        bachelor
      }
    });
  }
);

export {createBachelor, getBachelorFullData};
