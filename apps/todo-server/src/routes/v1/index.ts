import express from 'express';
import authRoute from './auth.route';
import taskRoute from './task.route';
import userRoute from './user.route';
import categoryRoute from './category.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/task',
    route: taskRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
