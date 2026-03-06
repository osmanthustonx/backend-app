import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import todos from './routes/todos.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = new Hono();

app.use('*', cors());
app.onError(errorHandler);

app.route('/api/todos', todos);

app.get('/health', (c) => c.json({ status: 'ok' }));

const port = Number(process.env.PORT) || 3001;
console.log(`Server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });

export default app;
