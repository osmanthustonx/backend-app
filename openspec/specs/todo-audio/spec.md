---
featureId: todo-audio
title: Todo 語音備忘功能
status: draft
owner: PM
depends: [add-todo-crud]
lastUpdated: 2026-03-10
---

# Todo 語音備忘功能

## 1. Summary

使用者可以為 todo 項目錄製或附加語音備忘，方便在不方便打字時快速記錄想法。

## 2. Users & Use Cases

**一般用戶**：開車、做家事時用語音快速記錄 todo 細節。

## 3. Functional Requirements

- 使用者可在建立或編輯 todo 時錄製語音（最長 60 秒）
- 支援格式：WebM、MP3
- 檔案大小限制：10 MB
- 清單頁面顯示語音圖示，點擊可播放

## 4. Behavioral Spec

### Scenario: 錄製語音備忘
  Given 使用者在 todo 編輯頁面
  When 使用者點擊「錄音」按鈕並說話 30 秒
  And 使用者點擊「停止」
  Then 語音應被附加到該 todo
  And 清單頁面顯示語音圖示

### Scenario: 語音超過 60 秒
  Given 使用者正在錄音
  When 錄音達到 60 秒
  Then 系統自動停止錄音
  And 顯示提示「已達最大錄音時間」

## 5. Scope

### In Scope
- 單個 todo 附加 1 段語音
- 錄製、播放、刪除

### Out of Scope
- 語音轉文字、多段語音、離線錄音

## 6. Dependencies & Open Questions

### Dependencies
- 依賴 add-todo-crud 的 Todo data model
