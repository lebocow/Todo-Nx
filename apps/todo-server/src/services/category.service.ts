import prisma from '../client';

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
      _count: {
        select: { tasks: true },
      },
    },
  });

  return {
    id: category.id,
    name: category.name,
    color: category.color,
    tasksCount: category._count.tasks,
  };
};

export const getCategoryById = async (id: string, userId: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
      userId,
    },
  });

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
      _count: {
        select: { tasks: true },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    tasksCount: category._count.tasks,
  }));
};
