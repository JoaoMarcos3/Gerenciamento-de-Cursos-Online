import { RequestHandler } from 'express';
import { moduleService } from '../services/module.service';

export const moduleController = {
  list: (async (_request, response) => response.status(200).json(await moduleService.list())) as RequestHandler,
  listByCourse: (async (request, response) => response.status(200).json(await moduleService.listByCourse(request.params.courseId))) as RequestHandler,
  get: (async (request, response) => response.status(200).json(await moduleService.get(request.params.id))) as RequestHandler,
  create: (async (request, response) => response.status(201).json(await moduleService.create(request.body))) as RequestHandler,
  update: (async (request, response) => response.status(200).json(await moduleService.update(request.params.id, request.body))) as RequestHandler,
  delete: (async (request, response) => {
    await moduleService.delete(request.params.id);
    response.status(204).end();
  }) as RequestHandler,
};
