import z from 'zod';
import { BaseUserSchema } from '@myworkspace/data-models';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { matchPassword } from '../utils';
import httpStatus from 'http-status';
import { exclude } from '../utils/exclude';

export const generateAuthToken = (user: z.infer<typeof BaseUserSchema>) => {
  return user.id;
};

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const isPasswordValid = await matchPassword(password, user.password);

  if (!isPasswordValid)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid password');

  return exclude(user, ['password']);
};
