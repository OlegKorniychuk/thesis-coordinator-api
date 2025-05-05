import {DiplomaCyclePhase, UserRole} from '@prisma/client';
import {supervisorController, supervisorInfoController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {protect} from 'middleware/protect.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';
import {restrictToRoles} from 'middleware/restrictToRoles.middleware';

const router = express.Router();

router.route('/*splat').all(protect);

router
  .route('/')
  .get(restrictToPhases(), supervisorController.getSupervisorsWithLoad)
  .post(
    restrictToRoles([UserRole.admin]),
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    supervisorController.createSupervisor
  );
router
  .route('/:supervisorId/change-max-load')
  .patch(
    restrictToRoles([UserRole.admin]),
    checkForBody,
    supervisorController.changeSupervisorMaxLoad
  );
router
  .route('/:supervisorId/info')
  .post(
    restrictToRoles([UserRole.supervisor]),
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    supervisorInfoController.createSupervisorInfo
  )
  .patch(
    restrictToRoles([UserRole.supervisor]),
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    supervisorInfoController.updateSupervisorInfo
  );

export default router;
