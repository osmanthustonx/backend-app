---
description: 執行測試並顯示測試規範
allowed-tools: Read, Bash
---

# 測試規範

執行測試並顯示本專案的測試實作指南。

測試 pattern: $ARGUMENTS

<instructions>

## 核心任務
1. 執行測試
2. 顯示本專案的測試慣例指南

## 執行步驟

### Step 1: 執行測試
- 如果有提供 `$ARGUMENTS`，運行 `npx vitest run $ARGUMENTS`
- 如果沒有提供，運行 `npm test`

### Step 2: 顯示測試慣例
向使用者展示本專案的測試規範（見下方快速檢查清單）。

</instructions>

## 快速檢查清單

- ✅ 測試檔案放在 `src/__tests__/` 目錄
- ✅ 用 `createApp()` helper 建立測試用 Hono app，掛載 routes + errorHandler
- ✅ `beforeEach` 呼叫 `store.clear()` 確保測試隔離
- ✅ 透過 `app.request(path, options)` 發送請求（Hono 內建，不需 supertest）
- ✅ 斷言 `res.status` 和 `json.success` / `json.data` / `json.error`
- ✅ 覆蓋 happy path、400 驗證錯誤、404 not found

## 典型測試結構

```typescript
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

  it('creates todo', async () => {
    const res = await app.request('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' }),
    });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.title).toBe('Test');
  });
});
```

## 相關指令

- `/code:check` - 執行所有品質檢查
- `/code:review` - 審查程式碼慣例
