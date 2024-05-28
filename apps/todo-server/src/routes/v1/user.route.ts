import express from 'express';

import { userController } from '../../controllers';

import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/:userId', auth(), userController.getUser);
// router.put('/:userId', auth(), userController.updateUser);
// router.delete('/:userId', auth(), userController.deleteUser);

export default router;
