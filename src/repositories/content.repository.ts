import { databasePool } from '../database/pool';
import { Content, ContentInput, ContentViewer } from '../types/entities';

export const contentRepository = {
  async list(): Promise<Content[]> {
    const result = await databasePool.query<Content>('SELECT * FROM contents ORDER BY created_at, id');
    return result.rows;
  },
  async findById(id: string): Promise<Content | null> {
    const result = await databasePool.query<Content>('SELECT * FROM contents WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },
  async listByModuleId(moduleId: string): Promise<Content[]> {
    const result = await databasePool.query<Content>(
      'SELECT * FROM contents WHERE module_id = $1 ORDER BY created_at, id', [moduleId],
    );
    return result.rows;
  },
  async create(input: ContentInput): Promise<Content> {
    const result = await databasePool.query<Content>(
      'INSERT INTO contents (module_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [input.module_id, input.title, input.content],
    );
    return result.rows[0];
  },
  async update(id: string, values: Partial<ContentInput>): Promise<Content | null> {
    const columns: Record<keyof ContentInput, string> = { module_id: 'module_id', title: 'title', content: 'content' };
    const keys = (Object.keys(columns) as (keyof ContentInput)[]).filter((key) => key in values);
    const assignments = keys.map((key, index) => `${columns[key]} = $${index + 1}`);
    const params: unknown[] = keys.map((key) => values[key]);
    params.push(id);
    const result = await databasePool.query<Content>(
      `UPDATE contents SET ${assignments.join(', ')} WHERE id = $${params.length} RETURNING *`, params,
    );
    return result.rows[0] ?? null;
  },
  async delete(id: string): Promise<boolean> {
    const result = await databasePool.query('DELETE FROM contents WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
  async recordWatch(contentId: string, userId: string): Promise<{ id: string; user_id: string; content_id: string; watched_at: string }> {
    const result = await databasePool.query(
      'INSERT INTO user_content_progress (user_id, content_id) VALUES ($1, $2) RETURNING id, user_id, content_id, watched_at',
      [userId, contentId],
    );
    return result.rows[0];
  },
  async listViewers(contentId: string): Promise<ContentViewer[]> {
    const result = await databasePool.query<ContentViewer>(
      `SELECT users.id, users.name, users.email, user_content_progress.watched_at
       FROM user_content_progress
       JOIN users ON users.id = user_content_progress.user_id
       WHERE user_content_progress.content_id = $1
       ORDER BY user_content_progress.watched_at, users.id`, [contentId],
    );
    return result.rows;
  },
};
