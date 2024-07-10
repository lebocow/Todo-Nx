import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(2).max(15),
  color: z
    .string()
    .length(7)
    .regex(/^#[0-9a-fA-F]{6}$/, { message: 'Invalid hex color' }),
});

export const CategorySchema = CreateCategorySchema.extend({
  id: z.string().uuid(),
  tasksCount: z.number().int(),
});

export type ICreateCategory = z.infer<typeof CreateCategorySchema>;
export type ICategory = z.infer<typeof CategorySchema>;
