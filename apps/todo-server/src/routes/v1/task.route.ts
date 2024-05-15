import express from 'express';

import { taskController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/test', auth(), taskController.test);

export default router;
