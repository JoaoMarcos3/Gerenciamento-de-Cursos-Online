import { Router } from 'express';
import { healthRouter } from './health.routes';
import { courseRouter } from './course.routes';
import { moduleRouter } from './module.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/courses', courseRouter);
apiRouter.use('/modules', moduleRouter);
