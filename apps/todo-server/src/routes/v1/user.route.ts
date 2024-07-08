import express from 'express';

import { userController } from '../../controllers';

import auth from '../../middlewares/auth';

const router = express.Router();

router.use(auth());

router.get('/:userId', userController.getUser);
// router.put('/:userId', userController.updateUser);
// router.delete('/:userId', userController.deleteUser);

export default router;
