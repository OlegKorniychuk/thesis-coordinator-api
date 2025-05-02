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

export default router;
