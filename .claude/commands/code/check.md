---
description: 執行所有程式碼品質檢查
allowed-tools: Bash
---

# 執行所有檢查

執行本專案的所有程式碼品質檢查。

<instructions>

## 核心任務
依序執行以下檢查：
1. TypeScript 編譯（build）
2. 單位測試（test）

## 執行步驟

### Step 1: 執行 TypeScript 編譯
運行 `npm run build` 確保所有 TypeScript 程式碼可以正確編譯。

### Step 2: 執行單位測試
運行 `npm test` 執行所有 Vitest 測試案例。

### Step 3: 報告結果
彙總所有檢查結果，以表格顯示通過/失敗狀態。

如果有任何檢查失敗，提供錯誤摘要和修正建議。

</instructions>

## 檢查項目

| 項目 | 命令 | 說明 |
|------|------|------|
| TypeScript 編譯 | `npm run build` | 確保型別正確、無編譯錯誤 |
| 單位測試 | `npm test` | 執行所有 Vitest 測試 |

## 相關指令

- `/code:test` - 僅執行測試並顯示測試規範
- `/code:review` - 審查程式碼慣例

## 預期結果

所有檢查都應該通過，才能提交程式碼或建立 PR。

✅ TypeScript 編譯通過
✅ 測試通過
