import {DiplomaCycle, UserRole} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import diplomaCycleService from 'services/diplomaCycle/diplomaCycle.service';
import supervisorService from 'services/supervisor/supervisor.service';
import {
  ValidateCreateSupervisor,
  ValidateUpdateSupervisorMaxLoad
} from 'services/supervisor/supervisor.validate';
import teacherService from 'services/teacher/teacher.service';
import authService from 'services/auth/auth.service';

const createSupervisor = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {teacherId, maxLoad} = ValidateCreateSupervisor.parse(req.body);
    const currentDiplomaCycle = req['currentDiplomaCycle'];

    const teacher = await teacherService.getTeacherById(teacherId);
    if (!teacher) return next(new AppError('Такого викладача не існує!', 400));

    const newUser = await authService.generateNewUser(
      UserRole.supervisor,
      currentDiplomaCycle.diploma_cycle_id
    );

    const newSupervisor = await supervisorService.createSupervisor({
      max_load: maxLoad,
      teacher: {
        connect: {
          teacher_id: teacher.teacher_id
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
        newSupervisor
      }
    });
  }
);

const changeSupervisorMaxLoad = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const updateData = {supervisorId: req.params.supervisorId, maxLoad: req.body.maxLoad};
    const {supervisorId, maxLoad} = ValidateUpdateSupervisorMaxLoad.parse(updateData);
    const assignedBachelors = await supervisorService.countSupervisorsBachelors(supervisorId);

    if (maxLoad < assignedBachelors)
      return next(
        new AppError(
          `Цей керівник вже має ${assignedBachelors} дипломників - навантаження не може бути меншим!`,
          400
        )
      );

    const updatedSupervisor = await supervisorService.changeSupervisorMaxLoad(
      maxLoad,
      supervisorId
    );

    res.status(200).json({
      status: 'succes',
      data: {
        updatedSupervisor
      }
    });
  }
);

const getSupervisorsWithLoad = catchError(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentCycle: DiplomaCycle = req['currentDiplomaCycle'];

    const supervisors = await supervisorService.getSupervisorsWithLoad(
      currentCycle.diploma_cycle_id
    );

    res.status(200).json({
      status: 'success',
      data: {
        supervisors
      }
    });
  }
);

export {createSupervisor, changeSupervisorMaxLoad, getSupervisorsWithLoad};
