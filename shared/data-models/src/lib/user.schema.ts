import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
