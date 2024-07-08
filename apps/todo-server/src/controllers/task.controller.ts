import {
  CreateTaskSchema,
  ICreateTask,
  IUpdateTask,
  IUser,
  UpdateTaskSchema,
} from '@myworkspace/data-models';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';

import httpStatus from 'http-status';
import { taskService } from '../services/';

export const createTask = catchAsync(async (req: Request, res: Response) => {
  CreateTaskSchema.parse(req.body);

  const user = req.user as IUser;

  const { title, description, dueDate, dueTime, categoryId } =
    req.body as ICreateTask;

  const task = await taskService.createTask(
    user.id,
    title,
    description,
    dueDate,
    dueTime,
    categoryId,
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

export const updateTask = catchAsync(async (req: Request, res: Response) => {
  UpdateTaskSchema.parse(req.body);

  const { id, title, description, dueDate, dueTime, categoryId } =
    req.body as IUpdateTask;

  const task = await taskService.updateTask(
    id,
    title,
    description,
    dueDate,
    dueTime,
    categoryId,
  );

  return res
    .status(httpStatus.OK)
    .json({ message: `Task ${title} updated successfully`, data: { task } });
});

export const deleteTaskById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const task = await taskService.deleteTaskById(id);

    return res.status(httpStatus.OK).json({
      message: `Task ${task.title} deleted successfully`,
      data: { task },
    });
  },
);

export const getTaskById = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello' });
};
