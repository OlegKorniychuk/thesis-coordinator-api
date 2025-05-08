import {authController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';
import {protect} from 'middleware/protect.middleware';

const router = express.Router();

router.route('/login').post(checkForBody, authController.logIn);
router.route('/refresh').post(authController.refreshAccessToken);
router.route('/logout').post(protect, authController.logout);
router.route('/me').get(protect, authController.getMyData);

export default router;
