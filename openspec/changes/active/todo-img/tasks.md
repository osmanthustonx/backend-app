---
featureId: todo-img
title: Todo 圖片附加功能 - 任務分解
lastUpdated: 2026-03-10
---

# Tasks

## 後端實現

### 1. 數據模型擴展
- [ ] Modify `src/types/todo.ts` — 添加 `imageId?` 和 `imagePath?` 欄位到 Todo 介面，添加 UpdateTodoInput 型別

### 2. 文件上傳中間件
- [ ] Create `src/middleware/upload.ts` — 實現 multipart form-data 解析和檔案保存邏輯，支援 JPG/PNG/WebP 格式檢查，返回相對路徑

### 3. 圖片驗證邏輯
- [ ] Modify `src/middleware/validator.ts` — 添加 `validateImageFile()` 驗證函式（格式、大小限制 5MB），整合到 `validateCreateInput()` 和 `validateUpdateInput()` 中

### 4. Store 層擴展
- [ ] Modify `src/store/todoStore.ts` —
  - 擴展 create/update 方法以支援 imageId 和 imagePath
  - 添加 deleteImage() 私有方法（移除磁碟文件）
  - 刪除 todo 時自動清理圖片

### 5. API 端點 - 建立 Todo（含圖片）
- [ ] Modify `src/routes/todos.ts` POST 端點 — 支援 multipart form-data 上傳，呼叫上傳中間件驗證圖片，存儲後返回 imagePath

### 6. API 端點 - 更新 Todo（含圖片替換）
- [ ] Modify `src/routes/todos.ts` PUT 端點 — 支援圖片替換（刪除舊圖，上傳新圖）和刪除圖片（image=null）

### 7. API 端點 - 刪除圖片
- [ ] Modify `src/routes/todos.ts` — 添加 DELETE `/api/todos/:id/image` 端點

### 8. 靜態文件服務
- [ ] Modify Hono 應用設置 — 配置 `public/` 目錄為靜態文件根目錄（確保圖片 URL 可被存取）

## 測試

### 9. Store 層測試
- [ ] Modify `src/__tests__/todoStore.test.ts` — 添加圖片相關測試
  - 建立 todo + 圖片
  - 更新圖片
  - 刪除圖片
  - 刪除 todo 時清理圖片

### 10. API 端點測試
- [ ] Modify `src/__tests__/todos.test.ts` — 添加 API 測試
  - POST /api/todos 含圖片（happy path）
  - PUT /api/todos/:id 替換圖片
  - DELETE /api/todos/:id/image
  - 上傳超過 5MB 的檔案（error case）
  - 上傳不支援格式（error case）

### 11. 中間件測試
- [ ] Create `src/__tests__/upload.test.ts` — 測試檔案上傳中間件
  - 有效格式上傳
  - 無效格式拒絕
  - 檔案過大拒絕
  - 檔案存儲驗證

## 清理

### 12. 確保目錄存在
- [ ] 運行時確保 `public/images/todos/` 目錄存在（應用啟動時自動建立）
