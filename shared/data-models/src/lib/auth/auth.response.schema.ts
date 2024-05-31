import { z } from 'zod';
import { BaseUserSchema } from '../user';
import { TokensSchema } from '../token';

export const LoginResponseSchema = z.object({
  user: BaseUserSchema,
  tokens: TokensSchema,
});

export const RegisterResponseSchema = z.object({
  user: BaseUserSchema,
});

export type ILoginResponse = z.infer<typeof LoginResponseSchema>;
export type IRegisterResponse = z.infer<typeof RegisterResponseSchema>;
