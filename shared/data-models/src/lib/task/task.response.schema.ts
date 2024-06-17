import { z } from 'zod';

export const TaskResponseSchema = z.object({
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

export type ITaskResponse = z.infer<typeof TaskResponseSchema>;
