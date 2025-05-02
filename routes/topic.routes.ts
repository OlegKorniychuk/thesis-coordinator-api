import {topicController} from 'controllers';
import express from 'express';
import {restrictToPhases} from 'middleware/restrictToPhases.middleware';

const router = express.Router();

router.route('/:topicId/confirm').patch(restrictToPhases(), topicController.confirmTopic);

export default router;
