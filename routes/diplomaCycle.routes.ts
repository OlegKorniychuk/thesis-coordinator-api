import {diplomaCycleController} from 'controllers';
import express from 'express';

const router = express.Router();

router.route('/').post(diplomaCycleController.startNewCycle);

export default router;
