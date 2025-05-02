import {DiplomaCyclePhase} from '@prisma/client';
import {supervisorController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router();

router
  .route('/')
  .get(restrictToPhases(), supervisorController.getSupervisorsWithLoad)
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    supervisorController.createSupervisor
  );
router
  .route('/:supervisorId/change-max-load')
  .patch(checkForBody, supervisorController.changeSupervisorMaxLoad);

export default router;
