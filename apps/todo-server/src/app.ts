import express from 'express';
import { UserSchema } from '@myworkspace/data-models';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  const parsedUser = UserSchema.parse(req.body);
  res.send({ message: 'Hello API' });
});

export default app;
