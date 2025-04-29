import express, {Request, Response} from 'express';
import diplomaCycleRouter from './diplomaCycle.routes';

const router = express.Router();

router.route('/hc').get((req: Request, res: Response): void => {
  res.status(200).json({status: 'ok'});
});
router.use('/diploma-cycles', diplomaCycleRouter);

export default router;
