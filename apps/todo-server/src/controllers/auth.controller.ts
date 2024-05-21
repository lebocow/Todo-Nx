import { Request, Response } from 'express';

import httpStatus from 'http-status';
import { z } from 'zod';

import { LoginSchema, RegistrationSchema } from '@myworkspace/data-models';

import { authService, tokenService, userService } from '../services';

import { catchAsync } from '../utils';

export const register = catchAsync(async (req: Request, res: Response) => {
  RegistrationSchema.parse(req.body);

  const { email, name, password } = req.body as z.infer<
    typeof RegistrationSchema
  >;

  const user = await userService.createUser(email, name, password);

  return res.status(httpStatus.CREATED).json({
    message: 'User created successfully',
    user,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  LoginSchema.parse(req.body);

  const { email, password } = req.body as z.infer<typeof LoginSchema>;

  const user = await authService.loginUserWithEmailAndPassword(email, password);

  const tokens = await tokenService.generateAuthTokens(user);

  return res.status(httpStatus.OK).json({ user, tokens });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);

  return res.status(httpStatus.OK).json(tokens);
});
