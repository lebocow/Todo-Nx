import { CreateTaskSchema, ICreateTask, IUser } from '@myworkspace/data-models';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';

import { taskService } from '../services/';
import httpStatus from 'http-status';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  CreateTaskSchema.parse(req.body);

  const user = req.user as IUser;

  const { title, description, dueDate, dueTime, categoryId } =
    req.body as ICreateTask;

  const task = await taskService.createTask(
    title,
    description,
    dueDate,
    dueTime,
    categoryId,
    user.id,
  );

  return res
    .status(httpStatus.CREATED)
    .json({ message: `Task ${title} created successfully`, data: { task } });
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;

  const tasks = await taskService.getTasks(user.id);

  return res
    .status(httpStatus.OK)
    .json({ message: 'Tasks retrieved successfully', data: { tasks } });
});

export const updateTask = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello' });
};

export const deleteTask = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello' });
};

export const getTaskById = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello' });
};
