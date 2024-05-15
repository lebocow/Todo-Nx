import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { fromError } from 'zod-validation-error';

export const errorConverter: ErrorRequestHandler = (
  err: PrismaClientKnownRequestError | ZodError | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = error.message;
    error = new ApiError(statusCode, message, false);
  }

  if (error instanceof ZodError) {
    const validationError = fromError(error);
    const statusCode = httpStatus.BAD_REQUEST;
    const message = validationError.message;

    error = new ApiError(statusCode, message, false, validationError.details);
  }

  return next(error);
};

export const errorHandler: ErrorRequestHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message, errors } = err;

  const response = {
    statusCode,
    message,
    errors,
  };

  return res.status(statusCode).json(response);
};
