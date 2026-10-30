import { RequestHandler } from 'express';
import { contentService } from '../services/content.service';
import { asyncHandler } from '../utils/async-handler';

export const contentController = {
  list: asyncHandler(async (_request, response) => response.status(200).json(await contentService.list())) as RequestHandler,
  get: asyncHandler(async (request, response) => response.status(200).json(await contentService.get(request.params.id))) as RequestHandler,
  listByModule: asyncHandler(async (request, response) => response.status(200).json(await contentService.listByModuleId(request.params.moduleId))) as RequestHandler,
  create: asyncHandler(async (request, response) => response.status(201).json(await contentService.create(request.body))) as RequestHandler,
  update: asyncHandler(async (request, response) => response.status(200).json(await contentService.update(request.params.id, request.body))) as RequestHandler,
  delete: asyncHandler(async (request, response) => {
    await contentService.delete(request.params.id);
    response.status(204).end();
  }) as RequestHandler,
  watch: asyncHandler(async (request, response) => response.status(201).json(await contentService.watch(request.params.id, request.body?.user_id))) as RequestHandler,
  viewers: asyncHandler(async (request, response) => response.status(200).json(await contentService.viewers(request.params.id))) as RequestHandler,
};
