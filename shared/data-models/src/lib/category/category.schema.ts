import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z
    .string()
    .length(7)
    .regex(/^#[0-9a-fA-F]{6}$/),
});

export type ICategory = z.infer<typeof CategorySchema>;
