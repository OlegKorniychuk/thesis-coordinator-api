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
import {ValidateUpdateBachelor} from 'services/bachelor/bachelor.validate';
import supervisorService from 'services/supervisor/supervisor.service';

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

const getBachelors = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // const {page, resultsPerPage} = req.query;
    // const bachelors = await bachelorService.getPaginatedBachelors(
    //   parseInt(page as string),
    //   parseInt(resultsPerPage as string)
    // );

    // const total = await bachelorService.getBachelorsCount();

    const bachelors = await bachelorService.getAllBachelors();

    res.status(200).json({
      status: 'success',
      data: {
        bachelors
      }
    });
  }
);

const updateBachelor = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bachelorId: string = req.params.bachelorId;
    const updateData = ValidateUpdateBachelor.parse(req.body);

    if (updateData.supervisorId) {
      const supervisorWithLoad = await supervisorService.getSupervisorWithLoad(
        updateData.supervisorId
      );

      if (supervisorWithLoad._count.bachelors === supervisorWithLoad.max_load)
        return next(
          new AppError(
            'Неможливо оновити дані бакалавра - обраний керівник не має вільних місць',
            400
          )
        );
    }

    const updatedBachelor = await bachelorService.updateBachelor({bachelorId, ...updateData});

    res.status(200).json({
      status: 'success',
      data: {
        updatedBachelor
      }
    });
  }
);

export {createBachelor, getBachelorFullData, getBachelors, updateBachelor};
