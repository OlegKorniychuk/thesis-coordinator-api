import {diplomaCycleController} from 'controllers';
import express from 'express';

const router = express.Router();

router.route('/').post(diplomaCycleController.startNewCycle);
router.route('/end-current-cycle').patch(diplomaCycleController.endCurrentCycle);

export default router;
