import express from 'express';

import { authController } from '../../controllers';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/generate-new-tokens', authController.generateNewTokens);
router.post(
  '/check-refresh-token-validity',
  authController.checkRefreshTokenValidity,
);
router.post('/refresh-token', authController.refreshToken);

export default router;
