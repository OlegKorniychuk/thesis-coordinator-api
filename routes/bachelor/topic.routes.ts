import {DiplomaCyclePhase} from '@prisma/client';
import {topicController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router({mergeParams: true});

router
  .route('/')
  .post(
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.supervisor_selection, DiplomaCyclePhase.topic_selection]),
    topicController.createTopic
  );

router.route('/:topicId/confirm').patch(restrictToPhases(), topicController.confirmTopic);

export default router;
