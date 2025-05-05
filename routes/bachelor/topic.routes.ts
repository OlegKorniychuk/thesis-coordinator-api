import {DiplomaCyclePhase, UserRole} from '@prisma/client';
import {topicController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';
import {restrictToRoles} from 'middleware/restrictToRoles.middleware';

const router = express.Router({mergeParams: true});

router
  .route('/')
  .post(
    restrictToRoles([UserRole.bachelor]),
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.supervisor_selection, DiplomaCyclePhase.topic_selection]),
    topicController.createTopic
  );

router
  .route('/:topicId/confirm')
  .patch(restrictToRoles([UserRole.admin]), restrictToPhases(), topicController.confirmTopic);
router
  .route('/:topicId/accept')
  .patch(
    restrictToRoles([UserRole.supervisor]),
    restrictToPhases([DiplomaCyclePhase.supervisor_selection, DiplomaCyclePhase.topic_selection]),
    topicController.acceptTopic
  );
router
  .route('/:topicId/reject')
  .patch(
    restrictToRoles([UserRole.supervisor]),
    checkForBody,
    restrictToPhases([DiplomaCyclePhase.supervisor_selection, DiplomaCyclePhase.topic_selection]),
    topicController.rejectTopic
  );

export default router;
