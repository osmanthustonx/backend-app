---
description: 顯示所有可用指令
allowed-tools: Read
---

# 指令參考

顯示本專案所有可用的 Claude Code 指令。

<instructions>

## 核心任務
顯示兩組指令的完整參考：OpenSpec 工作流指令和程式碼品質指令。

## 執行步驟

### Step 1: 顯示指令總覽
列出以下兩個表格，讓使用者快速了解可用指令。

</instructions>

## OpenSpec 工作流指令

| 指令 | 說明 |
|------|------|
| `/eng:start <功能名稱>` | 開始實作新的 spec（讀取 spec → 開 branch → 建 design + tasks → 實作） |
| `/eng:pr` | 實作完成後開 PR（收集資訊 → commit → push → 建 PR） |
| `/eng:challenge <功能名稱>` | 對 spec 設計提出質疑（在 product-specs 開 issue） |
| `/eng:refactor <描述>` | 執行重構（判斷是否影響對外行為 → 決定流程） |
| `/eng:update <功能名稱>` | PM 更新 spec 後，跟上變更（比對 diff → 更新 design/tasks） |

## 程式碼品質指令

| 指令 | 說明 |
|------|------|
| `/code:check` | 執行所有品質檢查（build + test） |
| `/code:test [pattern]` | 執行測試並顯示測試規範 |
| `/code:review [檔案路徑]` | 審查程式碼是否符合專案慣例 |
| `/code:fix [檔案路徑]` | 審查並自動修正程式碼問題 |
| `/code:help` | 顯示本說明 |

## 使用範例

```bash
# 開始實作一個新功能
/eng:start add-todo-crud

# 檢查程式碼品質
/code:check

# 審查特定檔案
/code:review src/routes/todos.ts

# 修正問題
/code:fix src/routes/todos.ts

# 實作完成，開 PR
/eng:pr
```
