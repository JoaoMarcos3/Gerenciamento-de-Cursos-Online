import { Router } from 'express';
import { contentController } from '../controllers/content.controller';

export const contentRouter = Router();

contentRouter.get('/', contentController.list);
contentRouter.get('/:id/viewers', contentController.viewers);
contentRouter.post('/:id/watch', contentController.watch);
contentRouter.get('/:id', contentController.get);
contentRouter.put('/:id', contentController.update);
contentRouter.delete('/:id', contentController.delete);
