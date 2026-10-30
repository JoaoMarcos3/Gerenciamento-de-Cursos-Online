import { Router } from 'express';
import { courseController } from '../controllers/course.controller';
import { moduleController } from '../controllers/module.controller';
import { asyncHandler } from '../middlewares/async-handler';

export const courseRouter = Router();

courseRouter.get('/:courseId/modules', asyncHandler(moduleController.listByCourse));
courseRouter.get('/', asyncHandler(courseController.list));
courseRouter.get('/:id', asyncHandler(courseController.get));
courseRouter.post('/', asyncHandler(courseController.create));
courseRouter.put('/:id', asyncHandler(courseController.update));
courseRouter.delete('/:id', asyncHandler(courseController.delete));
