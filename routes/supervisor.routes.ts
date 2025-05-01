import {supervisorController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';

const router = express.Router();

router.route('/').post(checkForBody, supervisorController.createSupervisor);
router
  .route('/:supervisorId/change-max-load')
  .patch(checkForBody, supervisorController.changeSupervisorMaxLoad);

export default router;
