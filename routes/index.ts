import express, {Request, Response} from 'express';

const router = express.Router();

router.route('/hc').get((req: Request, res: Response): void => {
  res.status(200).json({status: 'ok'});
});

export default router;
