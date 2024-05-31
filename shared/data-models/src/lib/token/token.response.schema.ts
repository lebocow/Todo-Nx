import { z } from 'zod';
import { BaseUserSchema } from '../user';
import { TokenSchema } from './token.schema';

export const RefreshTokenResponseSchema = z.object({
  user: BaseUserSchema,
  accessToken: TokenSchema,
});

export type IRefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;
