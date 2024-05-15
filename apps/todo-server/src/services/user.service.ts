import prisma from '../client';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { encrypt } from '../utils';

export const createUser = async (
  email: string,
  name: string,
  password: string
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

  return user;
};
