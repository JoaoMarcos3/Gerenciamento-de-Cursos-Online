import { RequestHandler } from 'express';
import { courseService } from '../services/course.service';

export const courseController = {
  list: (async (_request, response) => response.status(200).json(await courseService.list())) as RequestHandler,
  get: (async (request, response) => response.status(200).json(await courseService.get(request.params.id))) as RequestHandler,
  create: (async (request, response) => response.status(201).json(await courseService.create(request.body))) as RequestHandler,
  update: (async (request, response) => response.status(200).json(await courseService.update(request.params.id, request.body))) as RequestHandler,
  delete: (async (request, response) => {
    await courseService.delete(request.params.id);
    response.status(204).end();
  }) as RequestHandler,
};
