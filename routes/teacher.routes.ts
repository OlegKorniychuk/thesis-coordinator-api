import {teacherController} from 'controllers';
import express from 'express';

const router = express.Router();

router.route('/').post(teacherController.addTeacher).get(teacherController.getTeachers);

export default router;
