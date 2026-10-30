import { Router } from 'express';
import { userController } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.get('/', userController.list);
userRouter.get('/:id', userController.get);
userRouter.post('/', userController.create);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);
