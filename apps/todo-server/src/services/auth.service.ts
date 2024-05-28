import prisma from '../client';
import ApiError from '../utils/ApiError';
import { matchPassword } from '../utils';
import httpStatus from 'http-status';
import { exclude } from '../utils/exclude';
import { tokenService } from '.';
import { TokenType } from '@prisma/client';

export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
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

  return exclude(user, ['password', 'createdAt', 'updatedAt']);
};

export const refreshAuth = async (refreshToken: string) => {
  try {
    const refreshTokenData = await tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH,
    );

    const { userId } = refreshTokenData;

    await prisma.token.delete({
      where: {
        id: refreshTokenData.id,
      },
    });

    return tokenService.generateAuthTokens({ id: userId });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please Authenticate');
  }
};
