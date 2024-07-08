import express from 'express';

import { taskController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router.use(auth());

router.get('/', taskController.getTasks);
router.post('/create', taskController.createTask);
router.put('/update', taskController.updateTask);
router.delete('/:id', taskController.deleteTaskById);

export default router;
