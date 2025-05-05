import {UserRole} from '@prisma/client';
import {teacherController} from 'controllers';
import express from 'express';
import {protect} from 'middleware/protect.middleware';
import {restrictToRoles} from 'middleware/restrictToRoles.middleware';

const router = express.Router();

router.route('/*splat').all(protect);

router
  .route('/')
  .post(restrictToRoles([UserRole.admin]), teacherController.createTeacher)
  .get(restrictToRoles([UserRole.admin]), teacherController.getTeachers);

export default router;
