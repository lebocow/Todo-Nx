import { exclude } from './../utils/exclude';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';

export const createCategory = async (
  name: string,
  color: string,
  userId: string,
) => {
  const category = await prisma.category.create({
    data: {
      name,
      color,
      userId,
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });

  return category;
};

export const getCategoryById = async (id: string, userId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');

  return category;
};

export const getCategories = async (userId: string) => {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      color: true,
    },
  });

  if (!categories)
    throw new ApiError(httpStatus.NOT_FOUND, 'Categories not found');

  return categories;
};
