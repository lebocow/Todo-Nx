import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
