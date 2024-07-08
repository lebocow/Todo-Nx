import prisma from '../client';

export const createTask = async (
  userId: string,
  title: string,
  description: string,
  dueDate: Date,
  dueTime: string,
  categoryId: string,
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
export async function updateTask(
  id: string,
  title: string,
  description: string,
  dueDate: Date,
  dueTime: string,
  categoryId: string,
) {
  const task = await prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      dueDate,
      dueTime,
      categoryId,
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
}

export const deleteTaskById = async (id: string) => {
  const task = await prisma.task.delete({
    where: {
      id,
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
