import express from 'express';

import { categoryController } from '../../controllers/';
import auth from '../../middlewares/auth';

const router = express.Router();

router.use(auth());

router.get('/', categoryController.getCategories);
router.post('/create', categoryController.createCategory);

export default router;
