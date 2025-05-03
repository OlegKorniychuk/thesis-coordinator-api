import {DiplomaCyclePhase} from '@prisma/client';
import {supervisionRequestController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(restrictToPhases(), supervisionRequestController.getBachelorsSupervisionRequests)
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.supervisor_selection]),
    supervisionRequestController.createSupervisionRequest
  );

router
  .route('/:supervisionRequestId/accept')
  .patch(
    restrictToPhases([DiplomaCyclePhase.supervisor_selection]),
    supervisionRequestController.acceptSupervisionRequest
  );

router
  .route('/:supervisionRequestId/reject')
  .patch(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.supervisor_selection]),
    supervisionRequestController.rejectSupervisionRequest
  );

export default router;
