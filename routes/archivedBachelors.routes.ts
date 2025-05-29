import {archivedBachelorsController} from 'controllers';
import express from 'express';
import {protect} from 'middleware/protect.middleware';

const router = express.Router();

router.use(protect);

router.route('/years').get(archivedBachelorsController.getYears);
router.route('/years/:year').get(archivedBachelorsController.getByYear);

export default router;
