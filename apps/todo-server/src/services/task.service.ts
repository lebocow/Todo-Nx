import prisma from '../client';

export const createTask = async (
  title: string,
  description: string,
  dueDate: Date,
  dueTime: string,
  categoryId: string,
  userId: string,
) => {
  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate,
      dueTime,
      categoryId,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      dueTime: true,
      completed: true,
      category: {
        select: {
          id: true,
          color: true,
          name: true,
        },
      },
    },
  });

  return task;
};

export const getTasks = async (userId: string) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      dueTime: true,
      completed: true,
      category: {
        select: {
          id: true,
          color: true,
          name: true,
        },
      },
    },
  });

  return tasks;
};
