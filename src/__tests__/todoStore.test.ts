import { describe, it, expect, beforeEach } from 'vitest';
import * as store from '../store/todoStore.js';

describe('todoStore', () => {
  beforeEach(() => {
    store.clear();
  });

  it('creates a todo with title only', () => {
    const todo = store.create({ title: 'Buy milk' });
    expect(todo.id).toBeDefined();
    expect(todo.title).toBe('Buy milk');
    expect(todo.description).toBeUndefined();
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
  });

  it('creates a todo with title and description', () => {
    const todo = store.create({ title: 'Buy milk', description: '2 bottles' });
    expect(todo.description).toBe('2 bottles');
  });

  it('getAll returns all todos', () => {
    store.create({ title: 'Todo 1' });
    store.create({ title: 'Todo 2' });
    expect(store.getAll()).toHaveLength(2);
  });

  it('getAll with active filter returns only incomplete todos', () => {
    const t1 = store.create({ title: 'Todo 1' });
    store.create({ title: 'Todo 2' });
    store.toggleComplete(t1.id);
    expect(store.getAll('active')).toHaveLength(1);
  });

  it('getAll with completed filter returns only completed todos', () => {
    const t1 = store.create({ title: 'Todo 1' });
    store.create({ title: 'Todo 2' });
    store.toggleComplete(t1.id);
    expect(store.getAll('completed')).toHaveLength(1);
  });

  it('getById returns existing todo', () => {
    const todo = store.create({ title: 'Test' });
    expect(store.getById(todo.id)).toEqual(todo);
  });

  it('getById returns undefined for non-existent', () => {
    expect(store.getById('non-existent')).toBeUndefined();
  });

  it('toggleComplete flips completed status', () => {
    const todo = store.create({ title: 'Test' });
    expect(todo.completed).toBe(false);
    const toggled = store.toggleComplete(todo.id);
    expect(toggled?.completed).toBe(true);
    const toggledBack = store.toggleComplete(todo.id);
    expect(toggledBack?.completed).toBe(false);
  });

  it('toggleComplete returns undefined for non-existent', () => {
    expect(store.toggleComplete('non-existent')).toBeUndefined();
  });

  it('remove deletes existing todo', () => {
    const todo = store.create({ title: 'Test' });
    expect(store.remove(todo.id)).toBe(true);
    expect(store.getById(todo.id)).toBeUndefined();
  });

  it('remove returns false for non-existent', () => {
    expect(store.remove('non-existent')).toBe(false);
  });
});
