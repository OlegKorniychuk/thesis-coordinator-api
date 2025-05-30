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
import {StudentUser} from '@interfaces/namedUser.interface';
import Excel from 'exceljs';

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

const getBachelorByUserId = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: string = req.params['userId'];
    const bachelor = await bachelorService.getBachelorByUserId(userId);

    res.status(200).json({
      status: 'success',
      data: {
        bachelor
      }
    });
  }
);

const getBachelorsOfSupervisor = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const supervisorId: string = req.params.supervisorId;

    const bachelors = await bachelorService.getBachelorsBySupervisorId(supervisorId);
    console.log('SupervisorId:', supervisorId);

    res.status(200).json({
      status: 'success',
      data: {
        results: bachelors.length,
        bachelors
      }
    });
  }
);

const getBachelorsPasswords = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bachelorsWithPasswords = await bachelorService.getBachelorsWithPasswords();
    const formattedBachelors: StudentUser[] = bachelorsWithPasswords.map(bachelor => ({
      fullName: `${bachelor.student.last_name} ${bachelor.student.first_name} ${bachelor.student.second_name}`,
      login: bachelor.user.login,
      password: bachelor.user.password_plain,
      group: bachelor.student.group
    }));

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Дані Студентів');

    worksheet.columns = [
      {header: 'ПІБ', key: 'fullName'},
      {header: 'Група', key: 'group'},
      {header: 'Логін', key: 'login'},
      {header: 'Пароль', key: 'password'}
    ];

    formattedBachelors.forEach(item => worksheet.addRow(item));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader('Content-Disposition', 'attachment; filename="StudentLogins.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  }
);

export {
  createBachelor,
  getBachelorFullData,
  getBachelors,
  updateBachelor,
  getBachelorByUserId,
  getBachelorsOfSupervisor,
  getBachelorsPasswords
};
