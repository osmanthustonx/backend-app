import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilter } from '../types/todo.js';

export type SortOrder = 'asc' | 'desc';

const todos = new Map<string, Todo>();

export function create(input: CreateTodoInput): Todo {
  const now = new Date().toISOString();
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    completed: false,
    priority: input.priority || 'medium',
    createdAt: now,
    updatedAt: now,
  };
  todos.set(todo.id, todo);
  return todo;
}

export function getAll(
  filter: TodoFilter = 'all',
  sort: 'createdAt' = 'createdAt',
  order: SortOrder = 'desc',
): Todo[] {
  let result = Array.from(todos.values());
  switch (filter) {
    case 'active':
      result = result.filter((t) => !t.completed);
      break;
    case 'completed':
      result = result.filter((t) => t.completed);
      break;
  }
  result.sort((a, b) => {
    const cmp = a[sort].localeCompare(b[sort]);
    return order === 'asc' ? cmp : -cmp;
  });
  return result;
}

export function getById(id: string): Todo | undefined {
  return todos.get(id);
}

export function toggleComplete(id: string): Todo | undefined {
  const todo = todos.get(id);
  if (!todo) return undefined;
  todo.completed = !todo.completed;
  todo.updatedAt = new Date().toISOString();
  return todo;
}

export function update(id: string, input: UpdateTodoInput): Todo | undefined {
  const todo = todos.get(id);
  if (!todo) return undefined;
  if (input.title !== undefined) {
    todo.title = input.title.trim();
  }
  if (input.description !== undefined) {
    todo.description = input.description.trim() || undefined;
  }
  todo.updatedAt = new Date().toISOString();
  return todo;
}

export function search(keyword: string, filter: TodoFilter = 'all'): Todo[] {
  const lower = keyword.toLowerCase();
  const all = getAll(filter);
  return all.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      (t.description?.toLowerCase().includes(lower) ?? false),
  );
}

export function remove(id: string): boolean {
  return todos.delete(id);
}

export function clear(): void {
  todos.clear();
}
