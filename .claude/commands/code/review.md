---
description: 審查程式碼是否符合專案慣例
allowed-tools: Read, Bash, Grep
---

# 審查程式碼

根據本專案的慣例審查程式碼。

審查目標: $ARGUMENTS

<instructions>

## 核心任務
分析目標檔案是否符合本專案的程式碼慣例，並提供結構化的審查報告。

## 執行步驟

### Step 1: 確定審查範圍
- 如果 `$ARGUMENTS` 是檔案路徑 → 審查該檔案
- 如果 `$ARGUMENTS` 是 "all" → 審查 `src/` 下所有 `.ts` 檔案
- 如果 `$ARGUMENTS` 為空 → 用 `git diff --name-only main -- src/` 找出變更的檔案

### Step 2: 逐檔審查
對每個檔案，檢查以下慣例：

**錯誤處理**
- 使用 `AppError(statusCode, code, message)` 模式（定義在 `src/middleware/errorHandler.ts`）
- 不直接 throw 原生 Error 或回傳錯誤狀態碼

**回應格式**
- 成功回應：`{ success: true, data: ... }`
- 錯誤回應：`{ success: false, error: { code: string, message: string } }`
- 不使用其他格式

**輸入驗證**
- 驗證邏輯放在 `middleware/validator.ts` 的驗證函式中
- 驗證失敗 throw `AppError(400, 'VALIDATION_ERROR', '...')`
- Route handler 呼叫驗證函式取得已驗證的輸入

**程式碼風格**
- 提前返回：錯誤情況用 throw 或 return 提前結束，不深層巢狀
- 型別匯入：使用 `import type { ... }` 用於純型別匯入
- HTTP 狀態碼：201（create）、400（validation）、404（not found）、200（其他成功）

### Step 3: 生成報告
對每個檔案輸出結構化報告：
- ✅ **OK** — 符合慣例
- ⚠️ **WARN** — 建議改進
- ❌ **FIX** — 必須修正

報告格式：
```
## <檔案路徑>

✅ 錯誤處理：使用 AppError 模式
⚠️ 型別匯入：第 5 行 `import { Todo }` 應改為 `import type { Todo }`
❌ 回應格式：第 20 行回傳 `{ error: '...' }` 不符合標準格式
```

</instructions>

## 專案慣例摘要

| 慣例 | 正確做法 | 錯誤做法 |
|------|----------|----------|
| 錯誤處理 | `throw new AppError(400, 'VALIDATION_ERROR', 'msg')` | `return c.json({ error: 'msg' }, 400)` |
| 成功回應 | `c.json({ success: true, data: todo })` | `c.json(todo)` |
| 錯誤回應 | 由 `errorHandler` 統一處理 | 在 handler 中自行格式化 |
| 驗證 | 呼叫 `validator.ts` 的函式 | 在 route handler 中直接驗證 |
| 型別匯入 | `import type { Todo }` | `import { Todo }` |

## 相關指令

- `/code:fix` - 審查並自動修正問題
- `/code:check` - 執行所有品質檢查
