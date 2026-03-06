import { Hono } from 'hono';
import * as store from '../store/todoStore.js';
import { validateCreateInput, validateFilter } from '../middleware/validator.js';
import { AppError } from '../middleware/errorHandler.js';

const todos = new Hono();

todos.post('/', async (c) => {
  const body = await c.req.json();
  const input = validateCreateInput(body);
  const todo = store.create(input);
  return c.json({ success: true, data: todo }, 201);
});

todos.get('/', (c) => {
  const filter = validateFilter(c.req.query('filter'));
  const list = store.getAll(filter);
  return c.json({ success: true, data: list });
});

todos.patch('/:id', (c) => {
  const id = c.req.param('id');
  const todo = store.toggleComplete(id);
  if (!todo) {
    throw new AppError(404, 'NOT_FOUND', 'Todo not found');
  }
  return c.json({ success: true, data: todo });
});

todos.delete('/:id', (c) => {
  const id = c.req.param('id');
  const deleted = store.remove(id);
  if (!deleted) {
    throw new AppError(404, 'NOT_FOUND', 'Todo not found');
  }
  return c.json({ success: true, data: { id } });
});

export default todos;
