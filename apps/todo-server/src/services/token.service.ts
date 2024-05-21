import { BaseUserSchema } from '@myworkspace/data-models';
import z from 'zod';
import { TokenType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import prisma from '../client.js';

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

export const generateAuthTokens = async (
  user: z.infer<typeof BaseUserSchema>,
) => {
  const { id } = user;

  const accesTokenExpires =
    Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000;
  const accessToken = generateToken(
    id,
    new Date(accesTokenExpires),
    TokenType.ACCESS,
  );

  const refreshTokenExpires =
    Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000;
  const refreshToken = generateToken(
    id,
    new Date(refreshTokenExpires),
    TokenType.REFRESH,
  );

  await saveToken(
    id,
    refreshToken,
    new Date(refreshTokenExpires),
    TokenType.REFRESH,
  );

  return {
    access: {
      token: accessToken,
      expires: accesTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

export const verifyToken = async (token: string, type: TokenType) => {
  const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

  const userId = payload.sub;

  if (payload.type !== type) throw new Error('Invalid token type');

  const tokenData = await prisma.token.findFirst({
    where: {
      userId,
      token,
      type,
      blacklisted: false,
    },
  });

  if (!tokenData) throw new Error('Token not found!');

  return tokenData;
};
