import { Router } from 'express';
import { contentController } from '../controllers/content.controller';

export const moduleContentRouter = Router({ mergeParams: true });

moduleContentRouter.get('/', contentController.listByModule);
