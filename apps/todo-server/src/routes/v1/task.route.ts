import express from 'express';

import { taskController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth(), taskController.getTasks);
router.post('/create', auth(), taskController.createTask);

export default router;
