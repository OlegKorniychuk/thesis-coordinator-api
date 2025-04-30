import {supervisorController} from 'controllers';
import express from 'express';

const router = express.Router();

router.route('/').post(supervisorController.createSupervisor);

export default router;
