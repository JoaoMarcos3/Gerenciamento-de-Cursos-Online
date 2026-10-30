import { databasePool } from '../database/pool';
import { CourseInput } from '../types/entities';
import { HttpError, isUuid } from '../utils/errors';
import { courseRepository } from '../repositories/course.repository';

const fields = ['code', 'title', 'description', 'user_id'] as const;
type CourseField = typeof fields[number];

function validate(data: unknown, partial: boolean): Partial<CourseInput> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Request body must be a JSON object.');
  const body = data as Record<string, unknown>;
  const result: Partial<CourseInput> = {};
  for (const key of fields) {
    if (!(key in body)) continue;
    const value = body[key];
    if (key === 'description') {
      if (value !== null && typeof value !== 'string') throw new HttpError(400, 'description must be a string or null.');
      result.description = value;
    } else if (key === 'user_id') {
      if (!isUuid(value)) throw new HttpError(400, 'user_id must be a valid UUID.');
      result.user_id = value;
    } else {
      if (typeof value !== 'string' || value.trim().length === 0) throw new HttpError(400, `${key} is required and cannot be empty.`);
      result[key as 'code' | 'title'] = value.trim();
    }
  }
  if (!partial && (['code', 'title', 'user_id'] as const).some((key) => !(key in result))) throw new HttpError(400, 'code, title, and user_id are required.');
  if (partial && Object.keys(result).length === 0) throw new HttpError(400, 'At least one course field must be provided.');
  return result;
}

async function requireUser(id: string): Promise<void> {
  const result = await databasePool.query('SELECT 1 FROM users WHERE id = $1', [id]);
  if (result.rowCount === 0) throw new HttpError(404, 'User not found.');
}

export const courseService = {
  list: () => courseRepository.list(),
  async get(id: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    const course = await courseRepository.findById(id);
    if (!course) throw new HttpError(404, 'Course not found.');
    return course;
  },
  async create(data: unknown) {
    const input = validate(data, false) as CourseInput;
    await requireUser(input.user_id);
    return courseRepository.create(input);
  },
  async update(id: unknown, data: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    const values = validate(data, true);
    const existing = await courseRepository.findById(id);
    if (!existing) throw new HttpError(404, 'Course not found.');
    if (values.user_id) await requireUser(values.user_id);
    const updated = await courseRepository.update(id, values);
    if (!updated) throw new HttpError(404, 'Course not found.');
    return updated;
  },
  async delete(id: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    if (!await courseRepository.delete(id)) throw new HttpError(404, 'Course not found.');
  },
};
