import {Prisma, TopicStatus} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import bachelorService from 'services/bachelor/bachelor.service';
import topicService from 'services/topic/topic.service';
import {
  ValidateConfirmTopic,
  ValidateCreateTopic,
  ValidateRejectTopic
} from 'services/topic/topic.validate';

const confirmTopic = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const topicId: string = req.params.topicId;
  const {refinedTopic} = ValidateConfirmTopic.parse(req.body);
  const topicStatus = await topicService.getTopicStatus(topicId);

  if (topicStatus !== TopicStatus.on_confirmation)
    return next(new AppError('Дипломний керівник ще не подав цю тему на затвердження!', 400));

  const updatedTopic = await topicService.confirmTopic(topicId, refinedTopic);

  res.status(200).json({
    status: 'success',
    data: {
      updatedTopic
    }
  });
});

const proposeTopic = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const bachelorId: string = req.params.bachelorId;
    const data: Prisma.TopicUncheckedCreateInput = ValidateCreateTopic.parse({
      bachelor_id: bachelorId,
      ...req.body
    });
    const bachelor = await bachelorService.getBachelorById(bachelorId);

    if (!bachelor.supervisor_id)
      return next(new AppError('Дипломник без керівника не може створити тему!', 400));

    const newTopic = await topicService.createTopic(data);

    res.status(200).json({
      status: 'success',
      data: {
        newTopic
      }
    });
  }
);

const acceptTopic = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const topicId: string = req.params.topicId;
    const topicStatus = await topicService.getTopicStatus(topicId);

    if (topicStatus !== TopicStatus.pending)
      return next(new AppError('Цю тему вже було прийнято або відхилено!', 400));

    const updatedTopic = await topicService.updateTopicStatus(topicId, TopicStatus.on_confirmation);

    res.status(200).json({
      status: 'success',
      data: {
        updatedTopic
      }
    });
  }
);

const rejectTopic = catchError(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {topicId} = req.params;
    const {comment} = ValidateRejectTopic.parse(req.body);
    const topicStatus = await topicService.getTopicStatus(topicId);

    if (topicStatus !== TopicStatus.pending)
      return next(new AppError('Цю тему вже було прийнято або відхилено!', 400));

    const updatedTopic = await topicService.updateTopicStatus(
      topicId,
      TopicStatus.rejected,
      comment
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedTopic
      }
    });
  }
);

export {confirmTopic, proposeTopic, acceptTopic, rejectTopic};
