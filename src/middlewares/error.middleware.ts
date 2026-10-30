import { ErrorRequestHandler } from 'express';
import { HttpError } from '../utils/errors';

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({ error: error.message });
    return;
  }

  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    response.status(400).json({ error: 'Request body contains invalid JSON.' });
    return;
  }

  const databaseError = error as { code?: string; constraint?: string };
  if (databaseError.code === '23505') {
    response.status(409).json({ error: 'A course with this code already exists.' });
    return;
  }
  if (databaseError.code === '23503') {
    response.status(409).json({ error: 'The operation conflicts with related records.' });
    return;
  }
  if (databaseError.code === '22P02') {
    response.status(400).json({ error: 'A supplied value has an invalid format.' });
    return;
  }
  if (databaseError.code === '23502' || databaseError.code === '22001') {
    response.status(400).json({ error: 'A required value is missing or exceeds the allowed length.' });
    return;
  }

  console.error('Unexpected request error:', error);
  response.status(500).json({ error: 'An unexpected internal error occurred.' });
};
