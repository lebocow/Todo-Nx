import httpStatus from 'http-status';
import prisma from '../client';
import { encrypt, exclude } from '../utils';
import ApiError from '../utils/ApiError';

export const createUser = async (
  email: string,
  name: string,
  password: string,
) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists)
    throw new ApiError(httpStatus.CONFLICT, 'User already exists');

  const hashedPassword = await encrypt(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return exclude(user, ['password', 'createdAt', 'updatedAt']);
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  return exclude(user, ['password', 'createdAt', 'updatedAt']);
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  return exclude(user, ['password', 'createdAt', 'updatedAt']);
};

export const getUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};
