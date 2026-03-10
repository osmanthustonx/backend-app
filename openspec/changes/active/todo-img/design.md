---
featureId: todo-img
title: Todo 圖片附加功能 - 工程設計
author: Engineering
lastUpdated: 2026-03-10
---

# Todo 圖片附加功能 - 工程設計文檔

## Architecture Overview

### 模組結構
```
src/
├── types/todo.ts           ← 擴展 Todo 型別，加入 imageId/imagePath
├── store/todoStore.ts      ← 擴展 store，支援圖片附加/刪除邏輯
├── middleware/validator.ts ← 新增圖片驗證邏輯（格式、大小）
├── routes/todos.ts         ← 新增 POST /api/todos/:id/image、DELETE /api/todos/:id/image 等端點
├── middleware/upload.ts    ← 新建：文件上傳中間件（multer 或自實現）
└── __tests__/
    ├── todoStore.test.ts   ← 新增圖片相關 test
    └── todos.test.ts       ← 新增 API 端點 test
    └── upload.test.ts      ← 新建：上傳邏輯 test

public/
└── images/
    └── todos/              ← 圖片儲存目錄（相對路徑）
```

### 數據模型擴展

**Todo 類型擴展**:
```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageId?: string;        // ← 新增：圖片檔案名稱（唯一）
  imagePath?: string;      // ← 新增：相對路徑（如 '/images/todos/todo-123-abc.jpg'）
}

interface CreateTodoInput {
  title: string;
  description?: string;
  image?: File;            // ← 前端上傳的圖片
}

interface UpdateTodoInput {
  title?: string;
  description?: string;
  image?: File | null;     // ← 新圖片或 null 表示刪除
}

interface ImageValidationError {
  code: 'INVALID_FORMAT' | 'FILE_TOO_LARGE' | 'UPLOAD_FAILED';
  message: string;
}
```

## 具體技術方案

### 1. 圖片存儲方式
**決策**: 本地檔案系統存儲
- 圖片存放於 `public/images/todos/` 目錄
- 檔名格式: `{todoId}-{timestamp}-{randomStr}.{ext}`
- 例: `todo-123-1678900000-abc.jpg`
- 原因: Demo 項目，本地存儲最簡單、無外部依賴

### 2. 圖片驗證
**支援格式**: JPG、PNG、WebP
**大小限制**: 5 MB（字節）
**驗證邏輯** (`src/middleware/validator.ts`):
- `validateImageFile(file: File): { isValid: boolean; error?: ImageValidationError }`
- 檢查 MIME type 白名單
- 檢查檔案大小 ≤ 5MB
- 檢查副檔名與 MIME type 匹配

### 3. API 端點設計

#### 3.1 建立 Todo（包含圖片）
```http
POST /api/todos
Content-Type: multipart/form-data

body:
  - title: string (required)
  - description: string (optional)
  - image: File (optional, ≤ 5 MB)

response 201:
  {
    "id": "...",
    "title": "...",
    "imagePath": "/images/todos/todo-123-abc.jpg" // ← 新增
  }

response 400:
  { "error": "Invalid image format" }
  { "error": "File too large" }
```

#### 3.2 更新 Todo（包含圖片替換）
```http
PUT /api/todos/:id
Content-Type: multipart/form-data

body:
  - title: string (optional)
  - description: string (optional)
  - image: File (optional) ← 新圖片或 null（刪除）

response 200:
  {
    "id": "...",
    "imagePath": "/images/todos/todo-123-def.jpg" // ← 已更換
  }

response 404:
  { "error": "Todo not found" }
```

#### 3.3 刪除 Todo 圖片
```http
DELETE /api/todos/:id/image

response 200:
  { "success": true }

response 404:
  { "error": "Todo or image not found" }
```

#### 3.4 獲取 Todo（包含圖片資訊）
```http
GET /api/todos/:id

response 200:
  {
    "id": "...",
    "imagePath": "/images/todos/todo-123.jpg" // ← 若有圖片
  }
```

### 4. 文件上傳中間件
**實現方式**: 使用 Node.js 內建 API 解析 multipart/form-data
- 中間件名: `parseFormData()`
- 存放於 `src/middleware/upload.ts`
- 驗證後將檔案存至 `public/images/todos/`
- 返回檔案相對路徑

### 5. 圖片刪除邏輯
**觸發時機**:
1. 使用者點擊「刪除圖片」按鈕（呼叫 DELETE /api/todos/:id/image）
2. 使用者上傳新圖片時，自動刪除舊圖片
3. 刪除 todo 時，級聯刪除對應圖片

**實現**:
- `fs.unlink()` 移除舊檔案
- 若移除失敗，記錄 warn 但不中止流程

## Validation Strategy

### 圖片驗證規則
```typescript
function validateImageFile(file: File | undefined): boolean {
  if (!file) return true;  // 圖片為可選

  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!ALLOWED_MIMES.includes(file.type)) {
    throw AppError(400, 'Invalid image format. Allowed: JPG, PNG, WebP');
  }
  if (file.size > MAX_SIZE) {
    throw AppError(400, 'File too large. Max size: 5 MB');
  }
}
```

### 整合至現有驗證
- `validateCreateInput()` 擴展以支援 `image`
- `validateUpdateInput()` 擴展以支援 `image` 和 `image=null`（刪除）
- 驗證在路由層進行，異常拋出 AppError

## Error Handling Strategy

遵循現有 AppError 模式：

| 錯誤情況 | HTTP Status | error message |
|---------|-------------|---------------|
| 圖片格式不支援 | 400 | "Invalid image format. Allowed: JPG, PNG, WebP" |
| 檔案過大 | 400 | "File too large. Max size: 5 MB" |
| 上傳磁碟寫入失敗 | 500 | "Failed to save image" |
| Todo 不存在 | 404 | "Todo not found" |
| 刪除檔案失敗 | 500 | "Failed to delete image" |

**特殊情況**:
- 若檔案已存在於磁碟但資料庫未記錄，自動覆寫
- 若圖片檔案刪除失敗，記錄 warn 但返回 200（不阻擋使用者）
- 若上傳中途中斷，臨時檔案在下次啟動時自動清理（可選）

## 前端集成註記

前端應在以下位置展示圖片：
1. **清單頁面**: 若 `imagePath` 存在，顯示 `<img src={imagePath} alt="..." className="thumb" />`
2. **詳情頁面**: 若 `imagePath` 存在，顯示完整尺寸圖片，並提供「更換」、「刪除」按鈕
3. **編輯表單**: 提供檔案選擇器，驗證後顯示預覽

## 未來擴展點
- 伺服器端自動生成縮圖（搭配 Sharp 或 ImageMagick）
- 上傳進度報告（WebSocket 或 Server-Sent Events）
- 雲端存儲（S3、CloudFront）
- 圖片優化（WebP 轉換、壓縮）
