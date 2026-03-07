---
featureId: todo
title: TodoList CRUD
status: approved
owner: PM
lastUpdated: 2026-03-06
---

# TodoList CRUD

## 1. Summary

提供一個簡單的 TodoList 應用，讓用戶能夠建立、查看、篩選、完成及刪除待辦事項。

## 2. Users & Use Cases

**角色**：一般用戶（單一角色）

**使用情境**：
- 用戶想快速記錄一件待辦事項
- 用戶想查看所有待辦事項，或只看未完成 / 已完成的
- 用戶完成一件事後想標記為已完成
- 用戶想刪除不再需要的待辦事項

## 3. Functional Requirements

- **建立 Todo**：用戶輸入標題（必填，1-200 字元）和描述（選填，0-1000 字元），系統建立一筆新的 todo，預設狀態為 active。
- **列表 Todo**：用戶可以查看所有 todo，支援篩選：all（全部）、active（未完成）、completed（已完成）。
- **切換完成狀態**：用戶可以將 active todo 標記為 completed，也可以把 completed 切回 active。
- **刪除 Todo**：用戶可以永久刪除一筆 todo（無軟刪除）。

## 4. Behavioral Spec

### Create Todo

#### Scenario: 只輸入標題建立 todo
  Given 用戶在建立表單
  When 輸入標題 "買牛奶" 並提交
  Then 系統回傳 201，新 todo 出現在列表中，completed 為 false

#### Scenario: 標題為空
  Given 用戶在建立表單
  When 提交空白標題
  Then 系統回傳 400，錯誤訊息 "Title is required"

#### Scenario: 標題超過 200 字元
  Given 用戶在建立表單
  When 輸入超過 200 字元的標題並提交
  Then 系統回傳 400，錯誤訊息 "Title must be 200 characters or less"

### List Todos

#### Scenario: 列出所有 todo
  Given 系統中有 3 筆 todo（2 active, 1 completed）
  When 用戶請求 filter=all
  Then 回傳全部 3 筆

#### Scenario: 列出 active todo
  Given 系統中有 3 筆 todo（2 active, 1 completed）
  When 用戶請求 filter=active
  Then 只回傳 2 筆 active todo

### Toggle Complete

#### Scenario: 將 active todo 標記為 completed
  Given 一筆 active todo 存在
  When 用戶切換該 todo 的完成狀態
  Then todo 的 completed 變為 true

#### Scenario: 切換不存在的 todo
  Given 系統中不存在該 todo
  When 用戶嘗試切換
  Then 系統回傳 404，錯誤訊息 "Todo not found"

### Delete Todo

#### Scenario: 刪除存在的 todo
  Given 一筆 todo 存在
  When 用戶刪除該 todo
  Then 系統回傳 200，該 todo 從列表消失

#### Scenario: 刪除不存在的 todo
  Given 系統中不存在該 todo
  When 用戶嘗試刪除
  Then 系統回傳 404，錯誤訊息 "Todo not found"

## 5. Scope

### In Scope
- 基本 CRUD 操作
- In-memory 儲存
- 按狀態篩選

### Out of Scope
- 資料持久化、認證、分頁、到期日、優先級

## 6. Dependencies & Open Questions

### Dependencies
無外部功能依賴。

### Open Questions
- ID 格式：採用 UUID v4。
