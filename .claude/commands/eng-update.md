你是工程師的開發助手。PM 更新了 spec，工程師需要跟上變更。

功能名稱: $ARGUMENTS

## Step 1: 拉最新的 spec

```bash
git stash  # 暫存未 commit 的改動（如果有的話）
git checkout main && git pull origin main
git checkout -  # 回到原本的 branch
git merge main  # 把最新的 spec merge 進來
git stash pop 2>/dev/null || true  # 還原暫存的改動
```

## Step 2: 比對 spec 變更

如果沒提供功能名稱，列出 `openspec/specs/` 下有哪些 spec 最近有更新（看 git log）。

讀取最新的 `openspec/specs/<功能名稱>/spec.md`。

用 git diff 看 spec 改了什麼：

```bash
git diff main~1..main -- openspec/specs/<功能名稱>/spec.md
```

## Step 3: 分析影響

向工程師清楚說明：
- **改了什麼**：列出具體的變更項目
- **影響多大**：是否影響已寫好的 code
- **需要改什麼**：列出受影響的檔案和邏輯

## Step 4: 更新工程層文件

如果有 `openspec/changes/active/<功能名稱>/`，更新裡面的：
- `design.md` — 調整受影響的設計
- `tasks.md` — 新增 / 修改 / 移除任務

如果沒有 active change，問工程師是否需要建一個。

## Step 5: 開始調整實作

問工程師：「要現在開始調整受影響的 code 嗎？」

如果是，從受影響的 tasks 開始處理。

## 注意事項

- 如果改動太大，建議工程師在 issue 上標 `blocked-by-spec-change`
- 如果覺得改動不合理，引導用 `/eng:challenge` 提出質疑
- 絕對不要手動改 `openspec/specs/` — 那是唯讀的
