import { z } from 'zod';
import { CategorySchema } from '../category';

export const FullTaskSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  title: z.string().min(2).max(15),
  description: z.string(),
  dueDate: z
    .union([z.string().transform((str) => new Date(str)), z.date()])
    .refine(
      (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
      'Due date cannot be in the past',
    ),
  dueTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in the format HH:MM')
    .refine((time) => {
      const [hours, minutes] = time.split(':').map(Number);

      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    }, 'Invalid time'),
  completed: z.boolean(),
  categoryId: z.string().uuid().optional().nullable(),
  userId: z.string().uuid(),
  category: CategorySchema.nullable(),
});

export const TaskSchema = FullTaskSchema.pick({
  id: true,
  title: true,
  description: true,
  dueDate: true,
  dueTime: true,
  completed: true,
}).extend({
  category: CategorySchema.nullable(),
});
export type ITask = z.infer<typeof TaskSchema>;

export const CreateTaskSchema = FullTaskSchema.pick({
  title: true,
  description: true,
  dueDate: true,
  dueTime: true,
  categoryId: true,
});
export type ICreateTask = z.infer<typeof CreateTaskSchema>;
