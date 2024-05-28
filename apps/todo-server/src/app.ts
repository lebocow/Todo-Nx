import express from 'express';

import compression from 'compression';
import helmet from 'helmet';
import { xss } from 'express-xss-sanitizer';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';

import routes from './routes/v1';

import { errorConverter, errorHandler } from './middlewares';

import ApiError from './utils/ApiError';

import { jwtStrategy } from './config/passport';

const app = express();

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(xss());

app.use(compression());

app.use(cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/v1', routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
