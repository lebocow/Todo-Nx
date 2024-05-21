import express from 'express';

import { authController } from '../../controllers';

import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/register', auth(), authController.register);

router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

export default router;
