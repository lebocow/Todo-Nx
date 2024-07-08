import { z } from 'zod';
import { TaskSchema } from './task.schema';

export const CreateTaskResponseSchema = z.object({
  task: TaskSchema,
});
export type ICreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

export const UpdateTaskResponseSchema = z.object({
  task: TaskSchema,
});
export type IUpdateTaskResponse = z.infer<typeof UpdateTaskResponseSchema>;

export const TasksResponseSchema = z.object({
  tasks: z.array(TaskSchema),
});
export type ITasksResponse = z.infer<typeof TasksResponseSchema>;

export const DeleteTaskResponseSchema = z.object({
  task: TaskSchema,
});
export type IDeleteTaskResponse = z.infer<typeof DeleteTaskResponseSchema>;
