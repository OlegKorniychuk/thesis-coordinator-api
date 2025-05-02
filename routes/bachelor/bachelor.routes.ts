import {DiplomaCyclePhase} from '@prisma/client';
import {bachelorController, topicController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';
import supervisionRequestsRouter from './supervisionRequest.routes';

const router = express.Router();

router
  .route('/')
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    bachelorController.createBachelor
  );

router.route('/:bachelorId').get(restrictToPhases(), bachelorController.getBachelorFullData);

router.use('/:bachelorId/supervision-requests', supervisionRequestsRouter);

router
  .route('/:bachelorId/topics')
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.supervisor_selection, DiplomaCyclePhase.topic_selection]),
    topicController.createTopic
  );

export default router;
