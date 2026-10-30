import { QueryResult } from 'pg';
import { databasePool } from '../database/pool';
import { Module, ModuleInput } from '../types/entities';

export const moduleRepository = {
  async list(): Promise<Module[]> {
    const result = await databasePool.query<Module>('SELECT * FROM modules ORDER BY created_at, id');
    return result.rows;
  },
  async listByCourse(courseId: string): Promise<Module[]> {
    const result = await databasePool.query<Module>(
      'SELECT * FROM modules WHERE course_id = $1 ORDER BY created_at, id', [courseId],
    );
    return result.rows;
  },
  async findById(id: string): Promise<Module | null> {
    const result = await databasePool.query<Module>('SELECT * FROM modules WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },
  async create(input: ModuleInput): Promise<Module> {
    const result = await databasePool.query<Module>(
      'INSERT INTO modules (course_id, user_id, title, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [input.course_id, input.user_id, input.title, input.description],
    );
    return result.rows[0];
  },
  async update(id: string, values: Partial<ModuleInput>): Promise<Module | null> {
    const columns: Record<keyof ModuleInput, string> = {
      course_id: 'course_id', user_id: 'user_id', title: 'title', description: 'description',
    };
    const entries = (Object.keys(columns) as (keyof ModuleInput)[]).filter((key) => key in values);
    if (entries.length === 0) return this.findById(id);
    const assignments = entries.map((key, index) => `${columns[key]} = $${index + 1}`);
    const params = entries.map((key) => values[key]);
    params.push(id);
    const result: QueryResult<Module> = await databasePool.query<Module>(
      `UPDATE modules SET ${assignments.join(', ')} WHERE id = $${params.length} RETURNING *`, params,
    );
    return result.rows[0] ?? null;
  },
  async delete(id: string): Promise<boolean> {
    const result = await databasePool.query('DELETE FROM modules WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
