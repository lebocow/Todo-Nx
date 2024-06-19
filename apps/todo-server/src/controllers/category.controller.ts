import { Request, Response } from 'express';

import { categoryService } from '../services';

import {
  CreateCategorySchema,
  ICreateCategory,
  IUser,
} from '@myworkspace/data-models';
import { catchAsync } from '../utils';
import httpStatus from 'http-status';

export const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    CreateCategorySchema.parse(req.body);

    const user = req.user as IUser;

    const { name, color } = req.body as ICreateCategory;

    const category = await categoryService.createCategory(name, color, user.id);

    return res.status(httpStatus.CREATED).json({
      message: `Category ${name} was created successfully`,
      data: { category },
    });
  },
);

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as IUser;

  const categories = await categoryService.getCategories(user.id);

  return res.status(httpStatus.OK).json({
    message: 'Categories retrieved successfully',
    data: { categories },
  });
});
