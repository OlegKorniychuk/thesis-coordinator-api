import {DiplomaCyclePhase, UserRole} from '@prisma/client';
import {diplomaCycleController} from 'controllers';
import express from 'express';
import {protect} from 'middleware/protect.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';
import {restrictToRoles} from 'middleware/restrictToRoles.middleware';

const router = express.Router();

router.use(protect);

router.route('/').post(restrictToRoles([UserRole.admin]), diplomaCycleController.startNewCycle);
router
  .route('/end-current-cycle')
  .patch(
    restrictToRoles([UserRole.admin]),
    restrictToPhases([DiplomaCyclePhase.post_cycle]),
    diplomaCycleController.endCurrentCycle
  );
router.route('/get-current').get(diplomaCycleController.getCurrentCycle);

export default router;
