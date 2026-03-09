import { AppError } from './errorHandler.js';
import type { CreateTodoInput, UpdateTodoInput, TodoFilter } from '../types/todo.js';
import type { SortOrder } from '../store/todoStore.js';

const VALID_FILTERS: TodoFilter[] = ['all', 'active', 'completed'];

export function validateCreateInput(body: unknown): CreateTodoInput {
  if (!body || typeof body !== 'object') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is required');
  }

  const { title, description } = body as Record<string, unknown>;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Title is required');
  }

  if (title.trim().length > 300) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Title must be 300 characters or less');
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

export function validateUpdateInput(body: unknown): UpdateTodoInput {
  if (!body || typeof body !== 'object') {
    throw new AppError(400, 'VALIDATION_ERROR', 'Request body is required');
  }

  const { title, description } = body as Record<string, unknown>;

  if (title === undefined && description === undefined) {
    throw new AppError(400, 'VALIDATION_ERROR', 'At least one field (title or description) is required');
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Title cannot be empty');
    }
    if (title.trim().length > 300) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Title must be 300 characters or less');
    }
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
    title: title !== undefined ? (title as string).trim() : undefined,
    description: description !== undefined ? (description as string).trim() : undefined,
  };
}

export function validateFilter(value: string | undefined): TodoFilter {
  if (!value) return 'all';
  if (!VALID_FILTERS.includes(value as TodoFilter)) {
    throw new AppError(400, 'VALIDATION_ERROR', `Filter must be one of: ${VALID_FILTERS.join(', ')}`);
  }
  return value as TodoFilter;
}

export function validateSearchQuery(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.trim() || undefined;
}

const VALID_SORT_FIELDS = ['createdAt'] as const;
const VALID_ORDERS: SortOrder[] = ['asc', 'desc'];

export function validateSortParams(
  sort: string | undefined,
  order: string | undefined,
): { sort: 'createdAt'; order: SortOrder } {
  if (sort && !VALID_SORT_FIELDS.includes(sort as 'createdAt')) {
    throw new AppError(400, 'VALIDATION_ERROR', `Sort must be one of: ${VALID_SORT_FIELDS.join(', ')}`);
  }
  if (order && !VALID_ORDERS.includes(order as SortOrder)) {
    throw new AppError(400, 'VALIDATION_ERROR', `Order must be one of: ${VALID_ORDERS.join(', ')}`);
  }
  return {
    sort: (sort as 'createdAt') || 'createdAt',
    order: (order as SortOrder) || 'desc',
  };
}
