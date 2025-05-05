import express, {Request, Response} from 'express';
import diplomaCycleRouter from './diplomaCycle.routes';
import teacherRouter from './teacher.routes';
import supervisorRouter from './supervisor.routes';
import bachelorRoutes from './bachelor/bachelor.routes';
import topicRouter from './bachelor/topic.routes';
import authRouter from './auth.routes';

const router = express.Router();

router.route('/hc').get((req: Request, res: Response): void => {
  res.status(200).json({status: 'ok'});
});
router.use('/diploma-cycles', diplomaCycleRouter);
router.use('/teachers', teacherRouter);
router.use('/supervisors', supervisorRouter);
router.use('/bachelors', bachelorRoutes);
router.use('/topics', topicRouter);
router.use('/auth', authRouter);

export default router;
