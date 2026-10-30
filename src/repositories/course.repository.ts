import { QueryResult } from 'pg';
import { databasePool } from '../database/pool';
import { Course, CourseInput } from '../types/entities';

export const courseRepository = {
  async list(): Promise<Course[]> {
    const result = await databasePool.query<Course>('SELECT * FROM courses ORDER BY created_at, id');
    return result.rows;
  },
  async findById(id: string): Promise<Course | null> {
    const result = await databasePool.query<Course>('SELECT * FROM courses WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },
  async create(input: CourseInput): Promise<Course> {
    const result = await databasePool.query<Course>(
      'INSERT INTO courses (code, title, description, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [input.code, input.title, input.description, input.user_id],
    );
    return result.rows[0];
  },
  async update(id: string, values: Partial<CourseInput>): Promise<Course | null> {
    const columns: Record<keyof CourseInput, string> = {
      code: 'code', title: 'title', description: 'description', user_id: 'user_id',
    };
    const entries = (Object.keys(columns) as (keyof CourseInput)[]).filter((key) => key in values);
    if (entries.length === 0) return this.findById(id);
    const assignments = entries.map((key, index) => `${columns[key]} = $${index + 1}`);
    const params = entries.map((key) => values[key]);
    params.push(id);
    const result: QueryResult<Course> = await databasePool.query<Course>(
      `UPDATE courses SET ${assignments.join(', ')} WHERE id = $${params.length} RETURNING *`, params,
    );
    return result.rows[0] ?? null;
  },
  async delete(id: string): Promise<boolean> {
    const result = await databasePool.query('DELETE FROM courses WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
