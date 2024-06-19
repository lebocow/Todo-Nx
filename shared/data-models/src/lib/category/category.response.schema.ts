import { z } from 'zod';

import { CategorySchema } from './category.schema';

export const CreateCategoryResponseSchema = z.object({
  category: CategorySchema,
});
export type ICreateCategoryResponse = z.infer<
  typeof CreateCategoryResponseSchema
>;

export const CategoryResponseSchema = z.object({
  categories: z.array(CategorySchema),
});
export type ICategoryResponse = z.infer<typeof CategoryResponseSchema>;
