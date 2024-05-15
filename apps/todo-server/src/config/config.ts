import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = z.object({
  NODE_ENV: z
    .enum(['production', 'development', 'test'])
    .default('development'),
  PORT: z
    .string()
    .transform((x) => Number(x))
    .default('3000'),
  JWT_SECRET: z.string().min(1).describe('JWT secret key'),
  JWT_ACCESS_EXPIRATION_MINUTES: z
    .string()
    .transform((x) => Number(x))
    .default('30')
    .describe('minutes after which access tokens expire'),
  JWT_REFRESH_EXPIRATION_DAYS: z
    .string()
    .transform((x) => Number(x))
    .default('30')
    .describe('days after which refresh tokens expire'),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z
    .string()
    .transform((x) => Number(x))
    .default('10')
    .describe('minutes after which reset password token expires'),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z
    .string()
    .transform((x) => Number(x))
    .default('10')
    .describe('minutes after which verify email token expires'),
});

// Parse and validate environment variables
const envVars = envVarsSchema.safeParse(process.env);

if (!envVars.success) {
  const validationError = fromError(envVars.error);
  console.error('❌ Invalid environment variables:', validationError.details);
  process.exit(1);
}

export default {
  env: envVars.data.NODE_ENV,
  port: envVars.data.PORT,
  jwt: {
    secret: envVars.data.JWT_SECRET,
    accessExpirationMinutes: envVars.data.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.data.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.data.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes:
      envVars.data.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
};
