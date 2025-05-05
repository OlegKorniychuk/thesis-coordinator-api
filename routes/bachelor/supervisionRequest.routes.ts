import {DiplomaCyclePhase, UserRole} from '@prisma/client';
import {supervisionRequestController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';
import {restrictToRoles} from 'middleware/restrictToRoles.middleware';

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
    restrictToRoles([UserRole.supervisor]),
    restrictToPhases([DiplomaCyclePhase.supervisor_selection]),
    supervisionRequestController.acceptSupervisionRequest
  );

router
  .route('/:supervisionRequestId/reject')
  .patch(
    restrictToRoles([UserRole.supervisor]),
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.supervisor_selection]),
    supervisionRequestController.rejectSupervisionRequest
  );

export default router;
