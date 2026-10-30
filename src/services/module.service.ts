import { databasePool } from '../database/pool';
import { ModuleInput } from '../types/entities';
import { HttpError, isUuid } from '../utils/errors';
import { courseRepository } from '../repositories/course.repository';
import { moduleRepository } from '../repositories/module.repository';

const fields = ['course_id', 'user_id', 'title', 'description'] as const;
function validate(data: unknown, partial: boolean): Partial<ModuleInput> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Request body must be a JSON object.');
  const body = data as Record<string, unknown>;
  const result: Partial<ModuleInput> = {};
  for (const key of fields) {
    if (!(key in body)) continue;
    const value = body[key];
    if (key === 'description') {
      if (value !== null && typeof value !== 'string') throw new HttpError(400, 'description must be a string or null.');
      result.description = value;
    } else if (key === 'course_id' || key === 'user_id') {
      if (!isUuid(value)) throw new HttpError(400, `${key} must be a valid UUID.`);
      result[key] = value;
    } else {
      if (typeof value !== 'string' || value.trim().length === 0) throw new HttpError(400, 'title is required and cannot be empty.');
      result.title = value.trim();
    }
  }
  if (!partial && (['course_id', 'user_id', 'title'] as const).some((key) => !(key in result))) throw new HttpError(400, 'course_id, user_id, and title are required.');
  if (partial && Object.keys(result).length === 0) throw new HttpError(400, 'At least one module field must be provided.');
  return result;
}

async function requireUser(id: string): Promise<void> {
  const result = await databasePool.query('SELECT 1 FROM users WHERE id = $1', [id]);
  if (result.rowCount === 0) throw new HttpError(404, 'User not found.');
}
async function requireCourse(id: string): Promise<void> {
  if (!await courseRepository.findById(id)) throw new HttpError(404, 'Course not found.');
}

export const moduleService = {
  list: () => moduleRepository.list(),
  async listByCourse(id: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'courseId must be a valid UUID.');
    await requireCourse(id);
    return moduleRepository.listByCourse(id);
  },
  async get(id: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    const value = await moduleRepository.findById(id);
    if (!value) throw new HttpError(404, 'Module not found.');
    return value;
  },
  async create(data: unknown) {
    const input = validate(data, false) as ModuleInput;
    await requireCourse(input.course_id);
    await requireUser(input.user_id);
    return moduleRepository.create(input);
  },
  async update(id: unknown, data: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    const values = validate(data, true);
    if (!await moduleRepository.findById(id)) throw new HttpError(404, 'Module not found.');
    if (values.course_id) await requireCourse(values.course_id);
    if (values.user_id) await requireUser(values.user_id);
    const updated = await moduleRepository.update(id, values);
    if (!updated) throw new HttpError(404, 'Module not found.');
    return updated;
  },
  async delete(id: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    if (!await moduleRepository.delete(id)) throw new HttpError(404, 'Module not found.');
  },
};
