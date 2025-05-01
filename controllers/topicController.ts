import {TopicStatus} from '@prisma/client';
import {AppError} from '@utils/appError';
import {catchError} from '@utils/catchError';
import {Request, Response, NextFunction} from 'express';
import topicService from 'services/topic/topic.service';
import {ValidateConfirmTopic} from 'services/topic/topic.validate';

const confirmTopic = catchError(async (req: Request, res: Response, next: NextFunction) => {
  const updateData = {topicId: req.params.topicId, refinedTopic: req.body?.refinedTopic};
  const {topicId, refinedTopic} = ValidateConfirmTopic.parse(updateData);
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

export {confirmTopic};
