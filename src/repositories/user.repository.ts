import { databasePool } from '../database/pool';
import { User, UserInput } from '../types/entities';

export const userRepository = {
  async list(): Promise<User[]> {
    const result = await databasePool.query<User>('SELECT * FROM users ORDER BY created_at, id');
    return result.rows;
  },
  async findById(id: string): Promise<User | null> {
    const result = await databasePool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const result = await databasePool.query(
      'SELECT 1 FROM users WHERE LOWER(email) = LOWER($1) AND ($2::uuid IS NULL OR id <> $2)', [email, excludeId ?? null],
    );
    return (result.rowCount ?? 0) > 0;
  },
  async create(input: UserInput): Promise<User> {
    const result = await databasePool.query<User>(
      'INSERT INTO users (name, email, status) VALUES ($1, $2, $3) RETURNING *',
      [input.name, input.email, input.status],
    );
    return result.rows[0];
  },
  async update(id: string, values: Partial<UserInput>): Promise<User | null> {
    const columns: Record<keyof UserInput, string> = { name: 'name', email: 'email', status: 'status' };
    const keys = (Object.keys(columns) as (keyof UserInput)[]).filter((key) => key in values);
    const assignments = keys.map((key, index) => `${columns[key]} = $${index + 1}`);
    const params: unknown[] = keys.map((key) => values[key]);
    params.push(id);
    const result = await databasePool.query<User>(
      `UPDATE users SET ${assignments.join(', ')} WHERE id = $${params.length} RETURNING *`, params,
    );
    return result.rows[0] ?? null;
  },
  async delete(id: string): Promise<boolean> {
    const result = await databasePool.query('DELETE FROM users WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
