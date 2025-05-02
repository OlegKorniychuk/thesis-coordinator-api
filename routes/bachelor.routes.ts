import {DiplomaCyclePhase} from '@prisma/client';
import {bachelorController, supervisionRequestController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router();

router
  .route('/')
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    bachelorController.createBachelor
  );

router
  .route('/:bachelorId/supervision-requests')
  .get(restrictToPhases(), supervisionRequestController.getBachelorsSupervisionRequests);

export default router;
