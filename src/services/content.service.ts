import { databasePool } from '../database/pool';
import { contentRepository } from '../repositories/content.repository';
import { ContentInput } from '../types/entities';
import { HttpError, isUuid } from '../utils/errors';

const fields = ['module_id', 'title', 'content'] as const;
function validate(data: unknown, partial: boolean): Partial<ContentInput> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Request body must be a JSON object.');
  const body = data as Record<string, unknown>;
  const result: Partial<ContentInput> = {};
  for (const key of fields) {
    if (!(key in body)) continue;
    const value = body[key];
    if (key === 'module_id') {
      if (!isUuid(value)) throw new HttpError(400, 'module_id must be a valid UUID.');
      result.module_id = value;
    } else {
      if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, `${key} is required and cannot be empty.`);
      if (key === 'title' && value.trim().length > 200) throw new HttpError(400, 'title cannot exceed 200 characters.');
      result[key] = value.trim();
    }
  }
  if (!partial && fields.some((key) => !(key in result))) throw new HttpError(400, 'module_id, title, and content are required.');
  if (partial && Object.keys(result).length === 0) throw new HttpError(400, 'At least one content field must be provided.');
  return result;
}

async function requireModule(id: string): Promise<void> {
  const result = await databasePool.query('SELECT 1 FROM modules WHERE id = $1', [id]);
  if (result.rowCount === 0) throw new HttpError(404, 'Module not found.');
}

async function requireContent(id: unknown) {
  if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
  const content = await contentRepository.findById(id);
  if (!content) throw new HttpError(404, 'Content not found.');
  return content;
}

export const contentService = {
  list: () => contentRepository.list(),
  get: async (id: unknown) => requireContent(id),
  async listByModuleId(moduleId: unknown) {
    if (!isUuid(moduleId)) throw new HttpError(400, 'moduleId must be a valid UUID.');
    await requireModule(moduleId);
    return contentRepository.listByModuleId(moduleId);
  },
  async create(data: unknown) {
    const input = validate(data, false) as ContentInput;
    await requireModule(input.module_id);
    return contentRepository.create(input);
  },
  async update(id: unknown, data: unknown) {
    const existing = await requireContent(id);
    const values = validate(data, true);
    if (values.module_id) await requireModule(values.module_id);
    const content = await contentRepository.update(existing.id, values);
    if (!content) throw new HttpError(404, 'Content not found.');
    return content;
  },
  async delete(id: unknown) {
    const content = await requireContent(id);
    if (!await contentRepository.delete(content.id)) throw new HttpError(404, 'Content not found.');
  },
  async watch(id: unknown, userId: unknown) {
    const content = await requireContent(id);
    if (!isUuid(userId)) throw new HttpError(400, 'user_id must be a valid UUID.');
    const user = await databasePool.query('SELECT 1 FROM users WHERE id = $1', [userId]);
    if (user.rowCount === 0) throw new HttpError(404, 'User not found.');
    try {
      return await contentRepository.recordWatch(content.id, userId);
    } catch (error) {
      if ((error as { code?: string }).code === '23505') throw new HttpError(409, 'This user has already watched this content.');
      throw error;
    }
  },
  async viewers(id: unknown) {
    const content = await requireContent(id);
    return contentRepository.listViewers(content.id);
  },
};
