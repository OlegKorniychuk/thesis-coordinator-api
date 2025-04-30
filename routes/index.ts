import express, {Request, Response} from 'express';
import diplomaCycleRouter from './diplomaCycle.routes';
import teacherRouter from './teacher.routes';
import supervisorRoutes from './supervisor.routes';

const router = express.Router();

router.route('/hc').get((req: Request, res: Response): void => {
  res.status(200).json({status: 'ok'});
});
router.use('/diploma-cycles', diplomaCycleRouter);
router.use('/teachers', teacherRouter);
router.use('/supervisors', supervisorRoutes);

export default router;
