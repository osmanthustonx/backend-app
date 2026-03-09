# add-todo-crud — Tasks

## Tasks

- Modify `src/types/todo.ts` — 新增 `UpdateTodoInput` interface (`title?: string`, `description?: string`)
- Modify `src/store/todoStore.ts` — 新增 `update(id, input)` 函式，更新 title/description 和 updatedAt
- Modify `src/store/todoStore.ts` — 新增 `search(keyword, filter)` 函式，對 title/description 做 case-insensitive 比對
- Modify `src/store/todoStore.ts` — 修改 `getAll()` 支援 sort 和 order 參數，預設按 createdAt desc 排序
- Modify `src/middleware/validator.ts` — 新增 `validateUpdateInput()` 驗證函式
- Modify `src/middleware/validator.ts` — 新增 `validateSearchQuery()` 和 `validateSortParams()` 驗證函式
- Modify `src/routes/todos.ts` — 新增 `PUT /:id` route 實作編輯功能
- Modify `src/routes/todos.ts` — 擴充 `GET /` 支援 search、sort、order query params
- Modify `src/__tests__/todoStore.test.ts` — 補齊 update、search、sort 的單元測試
- Modify `src/__tests__/todos.test.ts` — 補齊 PUT /:id 和 GET / 新參數的整合測試

