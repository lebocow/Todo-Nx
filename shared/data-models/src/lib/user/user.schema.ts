import { TokenType } from '@prisma/client';
import { z } from 'zod';

export const BaseUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RegistrationSchema = BaseUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
  .extend({
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string().min(8),
    newPasswordConfirmation: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "New passwords don't match",
    path: ['newPasswordConfirmation'],
  });

export const TokenSchema = z.object({
  token: z.string(),
  expires: z.number().int().positive(),
  type: z.nativeEnum(TokenType),
});
