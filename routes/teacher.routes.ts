import {teacherController} from 'controllers';
import express from 'express';

const router = express.Router();

router.route('/').post(teacherController.createTeacher).get(teacherController.getTeachers);

export default router;
