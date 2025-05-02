import {DiplomaCyclePhase} from '@prisma/client';
import {diplomaCycleController} from 'controllers';
import express from 'express';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router();

router.route('/').post(diplomaCycleController.startNewCycle);
router
  .route('/end-current-cycle')
  .patch(restrictToPhases([DiplomaCyclePhase.post_cycle]), diplomaCycleController.endCurrentCycle);

export default router;
