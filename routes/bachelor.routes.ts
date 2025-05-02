import {DiplomaCyclePhase} from '@prisma/client';
import {bachelorController} from 'controllers';
import express from 'express';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router();

router
  .route('/')
  .post(restrictToPhases([DiplomaCyclePhase.preparation]), bachelorController.createBachelor);

export default router;
