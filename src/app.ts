import express from 'express';
import { apiRouter } from './routes';
import { errorHandler } from './middlewares/error.middleware';

export const app = express();

app.use(express.json());
app.use('/api', apiRouter);
app.use(errorHandler);
