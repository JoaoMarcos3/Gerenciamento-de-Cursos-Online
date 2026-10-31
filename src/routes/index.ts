import { Router } from 'express';
import { healthRouter } from './health.routes';
import { courseRouter } from './course.routes';
import { moduleRouter } from './module.routes';
import { userRouter } from './user.routes';
import { contentRouter } from './content.routes';
import { moduleContentRouter } from './module-content.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/courses', courseRouter);
apiRouter.use('/modules', moduleRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/contents', contentRouter);
apiRouter.use('/modules/:moduleId/contents', moduleContentRouter);
