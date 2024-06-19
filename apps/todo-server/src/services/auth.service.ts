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
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid password');

  return exclude(user, ['password', 'createdAt', 'updatedAt']);
};

export const refreshAuth = async (refreshToken: string) => {
  const refreshTokenData = await tokenService.verifyToken(
    refreshToken,
    TokenType.REFRESH,
  );

  if (!refreshTokenData)
    throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found');

  const { userId } = refreshTokenData;

  await prisma.token.delete({
    where: {
      id: refreshTokenData.id,
    },
  });

  return tokenService.generateAuthTokens({ id: userId });
};

export const logout = async (refreshToken: string) => {
  const tokenToDelete = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
      blacklisted: false,
    },
  });

  if (!tokenToDelete)
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');

  await prisma.token.delete({
    where: {
      id: tokenToDelete.id,
    },
  });
};
