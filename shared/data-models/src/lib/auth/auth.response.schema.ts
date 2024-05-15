import { z } from 'zod';
import { BaseUserSchema, TokenSchema } from '../user';

export const AuthResponseSchema = z.object({
  user: BaseUserSchema,
  tokens: z.object({
    access: TokenSchema,
    refresh: TokenSchema,
  }),
});
