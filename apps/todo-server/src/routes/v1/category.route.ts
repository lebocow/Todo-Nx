import express from 'express';

import { categoryController } from '../../controllers/';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth(), categoryController.getCategories);
router.post('/create', auth(), categoryController.createCategory);

export default router;
