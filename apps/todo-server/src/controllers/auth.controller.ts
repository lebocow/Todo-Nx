import { Request, Response } from 'express';

import httpStatus from 'http-status';

import {
  ILogin,
  IRegister,
  LoginSchema,
  RegisterSchema,
} from '@myworkspace/data-models';

import { authService, tokenService, userService } from '../services';

import { catchAsync } from '../utils';

import { TokenType } from '@prisma/client';

export const register = catchAsync(async (req: Request, res: Response) => {
  RegisterSchema.parse(req.body);

  const { email, name, password } = req.body as IRegister;

  const user = await userService.createUser(email, name, password);

  return res.status(httpStatus.CREATED).json({
    message: 'User created successfully',
    data: { user },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  LoginSchema.parse(req.body);

  const { email, password } = req.body as ILogin;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  return res.status(httpStatus.OK).json({
    message: 'Login successful',
    data: { user, tokens },
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const refreshTokenData = await tokenService.verifyToken(
    refreshToken,
    TokenType.REFRESH,
  );

  if (!refreshTokenData) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Invalid refresh token',
    });
  }

  const user = await userService.getUserById(refreshTokenData.userId);

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: 'User not found',
    });
  }

  const accessToken = await tokenService.generateAccessToken(user);

  return res.status(httpStatus.OK).json({
    message: 'Token validated successfully',
    data: { user, accessToken },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const refreshTokenData = await tokenService.verifyToken(
    refreshToken,
    TokenType.REFRESH,
  );

  if (!refreshTokenData) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'Invalid refresh token',
    });
  }

  await authService.logout(refreshToken);

  return res.status(httpStatus.OK).json({
    message: 'Logout successful',
  });
});
