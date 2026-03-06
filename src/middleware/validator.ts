import { AppError } from './errorHandler.js';
import type { CreateTodoInput, TodoFilter } from '../types/todo.js';

const VALID_FILTERS: TodoFilter[] = ['all', 'active', 'completed'];

export function validateCreateInput(body: unknown): CreateTodoInput {
  if (!body || typeof body !== 'object') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is required');
  }

  const { title, description } = body as Record<string, unknown>;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Title is required');
  }

  if (title.trim().length > 200) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Title must be 200 characters or less');
  }

  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      throw new AppError(400, 'VALIDATION_ERROR', 'Description must be a string');
    }
    if (description.length > 1000) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Description must be 1000 characters or less');
    }
  }

  return {
    title: title.trim(),
    description: description ? (description as string).trim() : undefined,
  };
}

export function validateFilter(value: string | undefined): TodoFilter {
  if (!value) return 'all';
  if (!VALID_FILTERS.includes(value as TodoFilter)) {
    throw new AppError(400, 'VALIDATION_ERROR', `Filter must be one of: ${VALID_FILTERS.join(', ')}`);
  }
  return value as TodoFilter;
}
