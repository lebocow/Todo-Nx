import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { userService } from '../services';
import { catchAsync } from '../utils';

export const getUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await userService.getUserById(userId);

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: 'User not found',
    });
  }

  return res.status(httpStatus.OK).json({
    message: 'User retrieved successfully',
    data: { user },
  });
});
