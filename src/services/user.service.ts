import { userRepository } from '../repositories/user.repository';
import { UserInput } from '../types/entities';
import { HttpError, isUuid } from '../utils/errors';

const fields = ['name', 'email', 'status'] as const;
function validate(data: unknown, partial: boolean): Partial<UserInput> {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new HttpError(400, 'Request body must be a JSON object.');
  const body = data as Record<string, unknown>;
  const result: Partial<UserInput> = {};
  for (const key of fields) {
    if (!(key in body)) continue;
    const value = body[key];
    if (key === 'status') {
      if (value !== 'active' && value !== 'inactive') throw new HttpError(400, 'status must be active or inactive.');
      result.status = value;
    } else {
      if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, `${key} is required and cannot be empty.`);
      if (key === 'name') {
        if (value.trim().length > 150) throw new HttpError(400, 'name cannot exceed 150 characters.');
        result.name = value.trim();
      } else {
        const email = value.trim().toLowerCase();
        if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'email must be a valid email address.');
        result.email = email;
      }
    }
  }
  if (!partial && !('name' in result && 'email' in result)) throw new HttpError(400, 'name and email are required.');
  if (partial && Object.keys(result).length === 0) throw new HttpError(400, 'At least one user field must be provided.');
  return result;
}

export const userService = {
  list: () => userRepository.list(),
  async get(id: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    const user = await userRepository.findById(id);
    if (!user) throw new HttpError(404, 'User not found.');
    return user;
  },
  async create(data: unknown) {
    const input = validate(data, false) as UserInput;
    input.status ??= 'active';
    if (await userRepository.emailExists(input.email)) throw new HttpError(409, 'A user with this email already exists.');
    return userRepository.create(input);
  },
  async update(id: unknown, data: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    const values = validate(data, true);
    if (!await userRepository.findById(id)) throw new HttpError(404, 'User not found.');
    if (values.email && await userRepository.emailExists(values.email, id)) throw new HttpError(409, 'A user with this email already exists.');
    const user = await userRepository.update(id, values);
    if (!user) throw new HttpError(404, 'User not found.');
    return user;
  },
  async delete(id: unknown) {
    if (!isUuid(id)) throw new HttpError(400, 'id must be a valid UUID.');
    if (!await userRepository.delete(id)) throw new HttpError(404, 'User not found.');
  },
};
