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

  return categories;
};
