import {Prisma, SupervisionRequestStatus} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import supervisionRequestService from 'services/supervisionRequest/supervisionRequest.service';
import {ValidateCreateSupervisionRequest} from 'services/supervisionRequest/supervisionRequest.validate';

const createSupervisionRequest = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data: Prisma.SupervisionRequestUncheckedCreateInput =
      ValidateCreateSupervisionRequest.parse(req.body);
    const existingRequest =
      await supervisionRequestService.getBachelorsSupervisionRequestToSupervisor(
        data.bachelor_id,
        data.supervisor_id
      );

    if (existingRequest?.status !== SupervisionRequestStatus.rejected)
      return next(
        new AppError('Неможливо надіслати повторний запит - попередній не був відхилений!', 400)
      );

    if (existingRequest) {
      await supervisionRequestService.deleteSupervisionRequest(
        existingRequest.supervision_request_id
      );
    }

    const newSupervisionRequest = await supervisionRequestService.createSupervisionRequest(data);

    res.status(200).json({
      status: 'success',
      data: {
        newSupervisionRequest
      }
    });
  }
);

const getBachelorsSupervisionRequests = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bachelorId: string = req.params.bachelorId;
    const supervisionRequests =
      await supervisionRequestService.getBachelorsSupervisionRequests(bachelorId);

    res.status(200).json({
      data: {
        supervisionRequests
      }
    });
  }
);

export {createSupervisionRequest, getBachelorsSupervisionRequests};
