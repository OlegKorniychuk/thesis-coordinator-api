import {authController} from 'controllers';
import express from 'express';
import {checkForBody} from 'middleware/checkForBody.middleware';

const router = express.Router();

router.route('/login').post(checkForBody, authController.logIn);
router.route('/refresh').post(authController.refreshAccessToken);
router.route('/logout').post(authController.logout);

export default router;
