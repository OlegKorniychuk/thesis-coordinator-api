import {UserRole} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import bachelorService from 'services/bachelor/bachelor.service';
import diplomaCycleService from 'services/diplomaCycle/diplomaCycle.service';
import studentService from 'services/student/student.service';
import {ValidateCreateStudent} from 'services/student/student.validate';
import userService from 'services/user/user.service';

const createBachelor = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const studentData = ValidateCreateStudent.parse(req.body);

  const newStudent = await studentService.createStudent(studentData);
  if (!newStudent) return next(new AppError('Помилка при збереженні студента!', 500));

  const currentDiplomaCycle = await diplomaCycleService.getCurrentDiplomaCycle();
  if (!currentDiplomaCycle)
    return next(
      new AppError('Неможливо створити дипломника - дипломний період не розпочато!', 400)
    );

  const newUser = await userService.generateNewUser(
    UserRole.supervisor,
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

export {createBachelor};
