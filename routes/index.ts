import express, {Request, Response} from 'express';
import diplomaCycleRouter from './diplomaCycle.routes';
import teacherRouter from './teacher.routes';
import supervisorRouter from './supervisor.routes';
import bachelorRoutes from './bachelor.routes';
import topicRouter from './topic.routes';
import supervisionRequestRouter from './supervisionRequest.routes';

const router = express.Router();

router.route('/hc').get((req: Request, res: Response): void => {
  res.status(200).json({status: 'ok'});
});
router.use('/diploma-cycles', diplomaCycleRouter);
router.use('/teachers', teacherRouter);
router.use('/supervisors', supervisorRouter);
router.use('/bachelors', bachelorRoutes);
router.use('/topics', topicRouter);
router.use('/supervision-requests', supervisionRequestRouter);

export default router;
