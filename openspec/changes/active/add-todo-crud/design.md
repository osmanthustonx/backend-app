# add-todo-crud — Engineering Design

## Architecture Overview

沿用現有 Hono + TypeScript 架構，擴充現有模組：

```
src/
├── types/todo.ts        — 新增 UpdateTodoInput 型別
├── store/todoStore.ts   — 新增 update、search、sorted getAll
├── middleware/validator.ts — 新增 validateUpdateInput、validateSearchQuery、validateSortParam
├── routes/todos.ts      — 新增 PUT /:id、擴充 GET / query params
└── __tests__/           — 補齊對應測試
```

不新增檔案，全部在現有模組內擴充。

## 技術方案

### Edit (PUT /api/todos/:id)
- 接收 `{ title?, description? }`，至少要有一個欄位
- 驗證規則與 create 相同（title ≤ 300 字元、description ≤ 1000 字元）
- 更新 `updatedAt` timestamp
- 找不到回 404

### Search (GET /api/todos?search=keyword)
- 在現有 `GET /` 加上 `search` query param
- 對 title 和 description 做 case-insensitive 子字串比對
- 可與 filter 合併使用

### Sort (GET /api/todos?sort=createdAt&order=asc|desc)
- 支援 `sort=createdAt`，預設 `order=desc`（最新在前）
- 在 store 層實作排序邏輯

## Validation Strategy

- 所有 input 驗證集中在 `middleware/validator.ts`
- 使用現有 `AppError` 回傳一致的錯誤格式
- Update 時 title 如果提供就不能為空字串

## Error Handling Strategy

- 沿用現有 `AppError` + `errorHandler` 模式
- 404: todo 不存在
- 400: 驗證失敗（空標題、超長文字、無效 sort/filter 參數）
- 500: 非預期錯誤由 global errorHandler 處理
