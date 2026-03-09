import { Hono } from 'hono';
import * as store from '../store/todoStore.js';
import { validateCreateInput, validateUpdateInput, validateFilter, validateSearchQuery, validateSortParams } from '../middleware/validator.js';
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
  const searchQuery = validateSearchQuery(c.req.query('search'));
  const { sort, order } = validateSortParams(c.req.query('sort'), c.req.query('order'));

  let list;
  if (searchQuery) {
    list = store.search(searchQuery, filter);
  } else {
    list = store.getAll(filter, sort, order);
  }
  return c.json({ success: true, data: list });
});

todos.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const input = validateUpdateInput(body);
  const todo = store.update(id, input);
  if (!todo) {
    throw new AppError(404, 'NOT_FOUND', 'Todo not found');
  }
  return c.json({ success: true, data: todo });
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
