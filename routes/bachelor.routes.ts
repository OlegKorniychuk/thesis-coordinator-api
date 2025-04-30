import {bachelorController} from 'controllers';
import express from 'express';
import bachelorService from 'services/bachelor/bachelor.service';

const router = express.Router();

router.route('/').post(bachelorController.createBachelor);

export default router;
