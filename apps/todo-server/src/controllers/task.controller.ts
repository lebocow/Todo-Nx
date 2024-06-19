import { Request, Response } from 'express';

export const createCategory = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello' });
};

export const getCategories = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello' });
};
