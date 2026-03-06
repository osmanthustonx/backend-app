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

    it('returns 400 for title exceeding 200 chars', async () => {
      const res = await app.request('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'a'.repeat(201) }),
      });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error.message).toBe('Title must be 200 characters or less');
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
