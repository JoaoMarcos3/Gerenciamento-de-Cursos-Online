import { RequestHandler } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/async-handler';

export const userController = {
  list: asyncHandler(async (_request, response) => response.status(200).json(await userService.list())) as RequestHandler,
  get: asyncHandler(async (request, response) => response.status(200).json(await userService.get(request.params.id))) as RequestHandler,
  create: asyncHandler(async (request, response) => response.status(201).json(await userService.create(request.body))) as RequestHandler,
  update: asyncHandler(async (request, response) => response.status(200).json(await userService.update(request.params.id, request.body))) as RequestHandler,
  delete: asyncHandler(async (request, response) => {
    await userService.delete(request.params.id);
    response.status(204).end();
  }) as RequestHandler,
};
