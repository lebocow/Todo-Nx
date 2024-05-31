import { TokenType } from '@prisma/client';
import { z } from 'zod';
import { BaseUserSchema } from '../user';

export const TokenSchema = z.object({
  token: z.string(),
  expires: z.number().int().positive(),
  type: z.nativeEnum(TokenType),
});

export const TokensSchema = z.object({
  access: TokenSchema,
  refresh: TokenSchema,
});

export type IToken = z.infer<typeof TokenSchema>;
export type ITokens = z.infer<typeof TokensSchema>;
