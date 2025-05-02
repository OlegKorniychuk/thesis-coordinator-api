import {DiplomaCyclePhase} from '@prisma/client';
import {supervisorController, supervisorInfoController} from 'controllers';
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
router
  .route('/:supervisorId/info')
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    supervisorInfoController.createSupervisorInfo
  )
  .patch(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    supervisorInfoController.updateSupervisorInfo
  );

export default router;
