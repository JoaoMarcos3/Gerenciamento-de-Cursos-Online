import { Router } from 'express';
import { moduleController } from '../controllers/module.controller';
import { asyncHandler } from '../middlewares/async-handler';

export const moduleRouter = Router();

moduleRouter.get('/', asyncHandler(moduleController.list));
moduleRouter.get('/:id', asyncHandler(moduleController.get));
moduleRouter.post('/', asyncHandler(moduleController.create));
moduleRouter.put('/:id', asyncHandler(moduleController.update));
moduleRouter.delete('/:id', asyncHandler(moduleController.delete));
