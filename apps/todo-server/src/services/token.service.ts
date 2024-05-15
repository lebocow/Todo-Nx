import { BaseUserSchema } from '@myworkspace/data-models';
import z from 'zod';
import { TokenType } from '@prisma/client';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const generateToken = (
  userId: string,
  expires: Date,
  type: TokenType,
  secret = config.jwt.secret
): string => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
    type,
  };
  return jwt.sign(payload, secret);
};

export const generateAuthTokens = async (
  user: z.infer<typeof BaseUserSchema>
) => {
  const { id } = user;

  const accesTokenExpires =
    Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000;
  const accessToken = generateToken(
    id,
    new Date(accesTokenExpires),
    TokenType.ACCESS
  );

  const refreshTokenExpires =
    Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000;
  const refreshToken = generateToken(
    id,
    new Date(refreshTokenExpires),
    TokenType.REFRESH
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
