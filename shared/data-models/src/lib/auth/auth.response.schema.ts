import { z } from 'zod';
import { BaseUserSchema } from '../user';
import { TokensSchema } from '../token';

export const AuthResponseSchema = z.object({
  user: BaseUserSchema,
  tokens: TokensSchema,
});

export type IAuthResponse = z.infer<typeof AuthResponseSchema>;
