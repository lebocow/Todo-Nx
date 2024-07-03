import { z } from 'zod';
import { TaskSchema } from './task.schema';

export const CreateTaskResponseSchema = z.object({
  task: TaskSchema,
});
export type ICreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

export const TaskResponseSchema = z.object({
  tasks: z.array(TaskSchema),
});
export type ITaskResponse = z.infer<typeof TaskResponseSchema>;
