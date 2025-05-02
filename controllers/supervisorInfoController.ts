import {Prisma} from '@prisma/client';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import supervisorInfoService from 'services/supervisorInfo/supervisorInfo.service';
import {
  ValidateCreateSupervisorInfo,
  ValidateUpdateSupervisorInfo
} from 'services/supervisorInfo/supervisorInfo.validate';

const createSupervisorInfo = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const supervisorId: string = req.params.supervisorId;
    const data: Prisma.SupervisorsInfoUncheckedCreateInput = ValidateCreateSupervisorInfo.parse({
      supervisor_id: supervisorId,
      ...req.body
    });
    const newSupervisorInfo = await supervisorInfoService.createSupervisorInfo(data);

    res.status(200).json({
      status: 'success',
      data: {
        newSupervisorInfo
      }
    });
  }
);

const updateSupervisorInfo = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const supervisorId: string = req.params.supervisorId;
    const data: Prisma.SupervisorsInfoUncheckedUpdateInput = ValidateUpdateSupervisorInfo.parse(
      req.body
    );
    const updatedSupervisorInfo = await supervisorInfoService.updateSupervisorInfo(
      supervisorId,
      data
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedSupervisorInfo
      }
    });
  }
);

export {createSupervisorInfo, updateSupervisorInfo};
