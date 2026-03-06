import type { Todo, CreateTodoInput, TodoFilter } from '../types/todo.js';

const todos = new Map<string, Todo>();

export function create(input: CreateTodoInput): Todo {
  const now = new Date().toISOString();
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  todos.set(todo.id, todo);
  return todo;
}

export function getAll(filter: TodoFilter = 'all'): Todo[] {
  const all = Array.from(todos.values());
  switch (filter) {
    case 'active':
      return all.filter((t) => !t.completed);
    case 'completed':
      return all.filter((t) => t.completed);
    default:
      return all;
  }
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

export function remove(id: string): boolean {
  return todos.delete(id);
}

export function clear(): void {
  todos.clear();
}
