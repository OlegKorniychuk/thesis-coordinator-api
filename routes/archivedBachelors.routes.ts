import {UserRole} from '@prisma/client';
import {archivedBachelorsController} from 'controllers';
import express from 'express';
import {protect} from 'middleware/protect.middleware';
import {restrictToRoles} from 'middleware/restrictToRoles.middleware';

const router = express.Router();

router.use(protect);

router.route('/years').get(restrictToRoles([UserRole.admin]), archivedBachelorsController.getYears);
router
  .route('/years/:year')
  .get(restrictToRoles([UserRole.admin]), archivedBachelorsController.getByYear);
router
  .route('/years/:year/report')
  .get(restrictToRoles([UserRole.admin]), archivedBachelorsController.generateReport);

export default router;
