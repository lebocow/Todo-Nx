import { Request, Response } from 'express';

export const test = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Hello' });
};

// export const hello = (req: Request, res: Response) => {
//   res.status(200).json({ message: 'Hello API' });
// };
