---
description: 審查並修正程式碼問題
allowed-tools: Read, Bash, Grep, Edit, MultiEdit
---

# 審查並修正

審查程式碼是否符合專案慣例，並自動修正問題。

修正目標: $ARGUMENTS

<instructions>

## 核心任務
1. 執行程式碼審查（同 `/code:review` 邏輯）
2. 識別所有不符合慣例的問題
3. 提供修正建議並在確認後自動修正
4. 驗證修正沒有破壞功能

## 執行步驟

### Step 1: 確定目標
- 如果 `$ARGUMENTS` 是檔案路徑 → 修正該檔案
- 如果 `$ARGUMENTS` 為空 → 用 `git diff --name-only main -- src/` 找出變更的檔案

### Step 2: 執行審查
對每個檔案檢查以下慣例：

- **錯誤處理**: 使用 `AppError(statusCode, code, message)` 模式
- **回應格式**: `{ success: true, data }` 或 `{ success: false, error: { code, message } }`
- **驗證**: 驗證邏輯在 `middleware/validator.ts`，驗證失敗 throw AppError
- **提前返回**: 錯誤情況 throw/return early，不深層巢狀
- **型別匯入**: 使用 `import type` 用於純型別匯入
- **HTTP 狀態碼**: 201 create / 400 validation / 404 not found / 200 其他

### Step 3: 分類問題
- 🔴 **Critical** — 影響功能或一致性，必須修正
- 🟡 **Warning** — 風格問題，建議修正
- 🟢 **Info** — 信息提示，可選修正

### Step 4: 確認修正
向使用者展示所有發現的問題，詢問：
- 「要一次修正所有問題嗎？還是逐一確認？」

### Step 5: 應用修正
使用 Edit 或 MultiEdit 工具修正，確保：
- 只修正不符合慣例的部分，不改變業務邏輯
- 保留既有的程式碼結構和註釋

### Step 6: 驗證
修正完成後執行：
1. `npm run build` — 確認 TypeScript 編譯通過
2. `npm test` — 確認測試仍然通過

如果驗證失敗，回退修正並告知使用者問題所在。

</instructions>

## 注意事項

- ✅ 自動修正不會改變業務邏輯
- ✅ 所有修正都會先呈現給使用者確認
- ✅ 修正後會自動跑 build + test 驗證
- ⚠️ 複雜的結構性問題可能需要手動處理

## 相關指令

- `/code:review` - 僅審查，不修正
- `/code:check` - 執行所有品質檢查
- `/code:test` - 執行測試
