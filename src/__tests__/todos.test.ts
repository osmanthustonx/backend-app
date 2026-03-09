import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import todos from '../routes/todos.js';
import { errorHandler } from '../middleware/errorHandler.js';
import * as store from '../store/todoStore.js';

function createApp() {
  const app = new Hono();
  app.onError(errorHandler);
  app.route('/api/todos', todos);
  return app;
}

describe('Todo API', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    store.clear();
    app = createApp();
  });

  describe('POST /api/todos', () => {
    it('creates todo with title only', async () => {
      const res = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Buy milk' }),
      });
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.title).toBe('Buy milk');
      expect(json.data.completed).toBe(false);
    });

    it('creates todo with title and description', async () => {
      const res = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Buy milk', description: '2 bottles' }),
      });
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.data.description).toBe('2 bottles');
    });

    it('returns 400 for empty title', async () => {
      const res = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.message).toBe('Title is required');
    });

    it('returns 400 for title exceeding 300 chars', async () => {
      const res = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'a'.repeat(301) }),
      });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.message).toBe('Title must be 300 characters or less');
    });
  });

  describe('GET /api/todos', () => {
    beforeEach(() => {
      store.create({ title: 'Todo 1' });
      store.create({ title: 'Todo 2' });
      const t3 = store.create({ title: 'Todo 3' });
      store.toggleComplete(t3.id);
    });

    it('lists all todos', async () => {
      const res = await app.request('/api/todos');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toHaveLength(3);
    });

    it('lists active todos only', async () => {
      const res = await app.request('/api/todos?filter=active');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toHaveLength(2);
      expect(json.data.every((t: { completed: boolean }) => !t.completed)).toBe(true);
    });

    it('lists completed todos only', async () => {
      const res = await app.request('/api/todos?filter=completed');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toHaveLength(1);
      expect(json.data[0].completed).toBe(true);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('toggles todo to completed', async () => {
      const todo = store.create({ title: 'Test' });
      const res = await app.request(`/api/todos/${todo.id}`, { method: 'PATCH' });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.completed).toBe(true);
    });

    it('toggles completed todo back to active', async () => {
      const todo = store.create({ title: 'Test' });
      store.toggleComplete(todo.id);
      const res = await app.request(`/api/todos/${todo.id}`, { method: 'PATCH' });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.completed).toBe(false);
    });

    it('returns 404 for non-existent todo', async () => {
      const res = await app.request('/api/todos/non-existent', { method: 'PATCH' });
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error.message).toBe('Todo not found');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('updates todo title', async () => {
      const todo = store.create({ title: 'Old title' });
      const res = await app.request(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New title' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.title).toBe('New title');
    });

    it('updates todo description', async () => {
      const todo = store.create({ title: 'Title', description: 'Old desc' });
      const res = await app.request(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'New desc' }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.description).toBe('New desc');
    });

    it('returns 400 when no fields provided', async () => {
      const todo = store.create({ title: 'Title' });
      const res = await app.request(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      expect(res.status).toBe(400);
    });

    it('returns 400 for empty title', async () => {
      const todo = store.create({ title: 'Title' });
      const res = await app.request(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      });
      expect(res.status).toBe(400);
    });

    it('returns 404 for non-existent todo', async () => {
      const res = await app.request('/api/todos/non-existent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New' }),
      });
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/todos with search', () => {
    it('searches todos by keyword', async () => {
      store.create({ title: 'Buy groceries' });
      store.create({ title: 'Read book' });
      store.create({ title: 'Buy milk' });
      const res = await app.request('/api/todos?search=buy');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toHaveLength(2);
    });

    it('search combined with filter', async () => {
      const t1 = store.create({ title: 'Buy groceries' });
      store.create({ title: 'Buy milk' });
      store.toggleComplete(t1.id);
      const res = await app.request('/api/todos?search=buy&filter=active');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data).toHaveLength(1);
    });
  });

  describe('GET /api/todos with sort', () => {
    it('returns todos sorted by createdAt desc by default', async () => {
      store.clear();
      const t1 = store.create({ title: 'First' });
      (t1 as any).createdAt = '2026-01-01T00:00:00.000Z';
      const t2 = store.create({ title: 'Second' });
      (t2 as any).createdAt = '2026-01-02T00:00:00.000Z';
      const res = await app.request('/api/todos');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data[0].title).toBe('Second');
    });

    it('returns todos sorted by createdAt asc', async () => {
      store.clear();
      const t1 = store.create({ title: 'First' });
      (t1 as any).createdAt = '2026-01-01T00:00:00.000Z';
      const t2 = store.create({ title: 'Second' });
      (t2 as any).createdAt = '2026-01-02T00:00:00.000Z';
      const res = await app.request('/api/todos?sort=createdAt&order=asc');
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data[0].title).toBe('First');
    });

    it('returns 400 for invalid sort field', async () => {
      const res = await app.request('/api/todos?sort=invalid');
      expect(res.status).toBe(400);
    });

    it('returns 400 for invalid order', async () => {
      const res = await app.request('/api/todos?order=invalid');
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes existing todo', async () => {
      const todo = store.create({ title: 'Test' });
      const res = await app.request(`/api/todos/${todo.id}`, { method: 'DELETE' });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.id).toBe(todo.id);
    });

    it('returns 404 for non-existent todo', async () => {
      const res = await app.request('/api/todos/non-existent', { method: 'DELETE' });
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.error.message).toBe('Todo not found');
    });
  });
});
