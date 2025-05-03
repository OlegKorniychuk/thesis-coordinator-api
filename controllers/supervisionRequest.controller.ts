import {Prisma, SupervisionRequestStatus} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import supervisionRequestService from 'services/supervisionRequest/supervisionRequest.service';
import {
  ValidateCreateSupervisionRequest,
  ValidateRejectSupervisionRequest
} from 'services/supervisionRequest/supervisionRequest.validate';

const createSupervisionRequest = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bachelorId: string = req.params.bachelorId;
    const data: Prisma.SupervisionRequestUncheckedCreateInput =
      ValidateCreateSupervisionRequest.parse({bachelor_id: bachelorId, ...req.body});
    const existingRequest =
      await supervisionRequestService.getBachelorsSupervisionRequestToSupervisor(
        data.bachelor_id,
        data.supervisor_id
      );

    if (existingRequest && existingRequest.status !== SupervisionRequestStatus.rejected)
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

const acceptSupervisionRequest = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {bachelorId, supervisionRequestId} = req.params;
    const supervisionRequest =
      await supervisionRequestService.getSupervisionRequestById(supervisionRequestId);

    if (supervisionRequest.status !== SupervisionRequestStatus.pending)
      return next(new AppError('Цей запит вже було прийнято або відхилено!', 400));

    const updatedSupervisionRequest =
      await supervisionRequestService.updateSupervisionRequestStatus(
        supervisionRequestId,
        SupervisionRequestStatus.accepted
      );
    await supervisionRequestService.deleteSupervisionRequestsOnAccepting(
      supervisionRequestId,
      bachelorId
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedSupervisionRequest
      }
    });
  }
);

const rejectSupervisionRequest = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {supervisionRequestId} = req.params;
    const {comment} = ValidateRejectSupervisionRequest.parse(req.body);
    const supervisionRequest =
      await supervisionRequestService.getSupervisionRequestById(supervisionRequestId);

    if (supervisionRequest.status !== SupervisionRequestStatus.pending)
      return next(new AppError('Цей запит вже було прийнято або відхилено!', 400));

    const updatedSupervisionRequest =
      await supervisionRequestService.updateSupervisionRequestStatus(
        supervisionRequestId,
        SupervisionRequestStatus.rejected,
        comment
      );

    res.status(200).json({
      status: 'success',
      data: {
        updatedSupervisionRequest
      }
    });
  }
);

export {
  createSupervisionRequest,
  getBachelorsSupervisionRequests,
  acceptSupervisionRequest,
  rejectSupervisionRequest
};
