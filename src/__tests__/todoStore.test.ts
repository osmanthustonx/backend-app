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

  describe('update', () => {
    it('updates title only', () => {
      const todo = store.create({ title: 'Old title', description: 'Desc' });
      const updated = store.update(todo.id, { title: 'New title' });
      expect(updated?.title).toBe('New title');
      expect(updated?.description).toBe('Desc');
      expect(updated!.updatedAt > todo.updatedAt || updated!.updatedAt === todo.updatedAt).toBe(true);
    });

    it('updates description only', () => {
      const todo = store.create({ title: 'Title', description: 'Old desc' });
      const updated = store.update(todo.id, { description: 'New desc' });
      expect(updated?.title).toBe('Title');
      expect(updated?.description).toBe('New desc');
    });

    it('updates both title and description', () => {
      const todo = store.create({ title: 'Old', description: 'Old desc' });
      const updated = store.update(todo.id, { title: 'New', description: 'New desc' });
      expect(updated?.title).toBe('New');
      expect(updated?.description).toBe('New desc');
    });

    it('clears description when set to empty string', () => {
      const todo = store.create({ title: 'Title', description: 'Some desc' });
      const updated = store.update(todo.id, { description: '' });
      expect(updated?.description).toBeUndefined();
    });

    it('returns undefined for non-existent todo', () => {
      expect(store.update('non-existent', { title: 'New' })).toBeUndefined();
    });
  });

  describe('search', () => {
    it('finds todos by title keyword', () => {
      store.create({ title: 'Buy groceries' });
      store.create({ title: 'Read book' });
      store.create({ title: 'Buy milk' });
      const results = store.search('buy');
      expect(results).toHaveLength(2);
    });

    it('finds todos by description keyword', () => {
      store.create({ title: 'Task 1', description: 'important meeting' });
      store.create({ title: 'Task 2', description: 'casual chat' });
      const results = store.search('meeting');
      expect(results).toHaveLength(1);
    });

    it('search is case-insensitive', () => {
      store.create({ title: 'BUY MILK' });
      const results = store.search('buy milk');
      expect(results).toHaveLength(1);
    });

    it('search with filter returns filtered results', () => {
      const t1 = store.create({ title: 'Buy groceries' });
      store.create({ title: 'Buy milk' });
      store.toggleComplete(t1.id);
      const results = store.search('buy', 'active');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Buy milk');
    });

    it('returns empty array when no match', () => {
      store.create({ title: 'Buy milk' });
      expect(store.search('xyz')).toHaveLength(0);
    });
  });

  describe('getAll sorting', () => {
    it('sorts by createdAt desc by default', () => {
      const t1 = store.create({ title: 'First' });
      // Manually set different timestamps to ensure deterministic sorting
      (t1 as any).createdAt = '2026-01-01T00:00:00.000Z';
      const t2 = store.create({ title: 'Second' });
      (t2 as any).createdAt = '2026-01-02T00:00:00.000Z';
      const results = store.getAll();
      expect(results[0].id).toBe(t2.id);
      expect(results[1].id).toBe(t1.id);
    });

    it('sorts by createdAt asc when specified', () => {
      const t1 = store.create({ title: 'First' });
      (t1 as any).createdAt = '2026-01-01T00:00:00.000Z';
      const t2 = store.create({ title: 'Second' });
      (t2 as any).createdAt = '2026-01-02T00:00:00.000Z';
      const results = store.getAll('all', 'createdAt', 'asc');
      expect(results[0].id).toBe(t1.id);
      expect(results[1].id).toBe(t2.id);
    });
  });
});
