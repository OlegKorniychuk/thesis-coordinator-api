import {DiplomaCyclePhase, UserRole} from '@prisma/client';
import {bachelorController, topicController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';
import supervisionRequestsRouter from './supervisionRequest.routes';
import topicRouter from './topic.routes';
import {protect} from 'middleware/protect.middleware';
import {restrictToRoles} from 'middleware/restrictToRoles.middleware';

const router = express.Router();

router.route('/*splat').all(protect);

router
  .route('/')
  .post(
    restrictToRoles([UserRole.admin]),
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    bachelorController.createBachelor
  );

router.route('/:bachelorId').get(restrictToPhases(), bachelorController.getBachelorFullData);

router.use('/:bachelorId/supervision-requests', supervisionRequestsRouter);
router.use('/:bachelorId/topics', topicRouter);

export default router;
