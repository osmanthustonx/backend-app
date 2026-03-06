# Engineering Design: TodoList CRUD (Backend)

## Architecture Overview

```
src/
  index.ts           ← Hono app entry, middleware registration, route mounting
  types/todo.ts      ← Shared types
  store/todoStore.ts ← In-memory Map store with CRUD methods
  routes/todos.ts    ← Hono router with 4 CRUD endpoints
  middleware/
    errorHandler.ts  ← Global error handler
    validator.ts     ← Input validation helpers
```

## Route Design

| Route | Handler |
|-------|---------|
| POST /api/todos | createTodo |
| GET /api/todos | listTodos |
| PATCH /api/todos/:id | toggleTodo |
| DELETE /api/todos/:id | deleteTodo |

## Data Layer

In-memory Map<string, Todo> store with crypto.randomUUID().

## Validation Strategy

Inline: title required 1-200 chars, description optional max 1000, filter must be all/active/completed.

## Error Handling

AppError class + global onError handler returning { success: false, error: { code, message } }.
