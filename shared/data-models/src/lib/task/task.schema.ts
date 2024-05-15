import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  completed: z.boolean(),
  categoryId: z.string().uuid(),
  userId: z.string().uuid(),
});
