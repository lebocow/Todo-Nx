import { BaseUserSchema, ITokens } from '@myworkspace/data-models';
import z from 'zod';
import { TokenType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import prisma from '../client.js';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  type: TokenType;
}

const generateToken = (
  userId: string,
  expires: Date,
  type: TokenType,
  secret = config.jwt.secret,
): string => {
  const payload: JwtPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  userId: string,
  token: string,
  expires: Date,
  type: TokenType,
  blacklisted = false,
) => {
  const existingToken = await prisma.token.findFirst({
    where: {
      userId,
      type,
    },
  });

  if (existingToken) {
    await prisma.token.update({
      where: {
        id: existingToken.id,
      },
      data: {
        token,
        expires,
        blacklisted,
      },
    });

    return existingToken;
  }

  return await prisma.token.create({
    data: {
      userId,
      token,
      expires,
      type,
      blacklisted,
    },
  });
};

export const generateAccessToken = async (
  user: z.infer<typeof BaseUserSchema>,
) => {
  const { id: userId } = user;

  const expires = Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000;

  const token = generateToken(userId, new Date(expires), TokenType.ACCESS);

  return { token, expires, type: TokenType.ACCESS };
};

export const generateAuthTokens = async (
  user: z.infer<typeof BaseUserSchema>,
): Promise<ITokens> => {
  const { id: userId } = user;

  const accessTokenExpires =
    Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000;

  const refreshTokenExpires =
    Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000;

  const accessToken = generateToken(
    userId,
    new Date(accessTokenExpires),
    TokenType.ACCESS,
  );

  const refreshToken = generateToken(
    userId,
    new Date(refreshTokenExpires),
    TokenType.REFRESH,
  );

  await saveToken(
    userId,
    refreshToken,
    new Date(refreshTokenExpires),
    TokenType.REFRESH,
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
      type: TokenType.ACCESS,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
      type: TokenType.REFRESH,
    },
  };
};

export const verifyToken = async (token: string, type: TokenType) => {
  const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

  const userId = payload.sub;

  if (payload.type !== type)
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid token type');

  const tokenData = await prisma.token.findFirst({
    where: {
      userId,
      token,
      type,
      blacklisted: false,
    },
  });

  if (!tokenData) throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');

  return tokenData;
};
