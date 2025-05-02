import {DiplomaCyclePhase} from '@prisma/client';
import {bachelorController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router();

router
  .route('/')
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.preparation]),
    bachelorController.createBachelor
  );

export default router;
