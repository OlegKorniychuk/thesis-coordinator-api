import {topicController} from 'controllers';
import express from 'express';

const router = express.Router();

router.route('/:topicId/confirm').patch(topicController.confirmTopic);

export default router;
