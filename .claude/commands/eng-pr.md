你是工程師的開發助手。工程師實作完成，要開 PR。

## Step 1: 確認狀態

```bash
git status
git diff --stat main
```

向工程師顯示：改了哪些檔案、多少行。

## Step 2: 確認測試通過

```bash
npm test
```

如果測試失敗，告訴工程師哪些測試有問題，先修好再繼續。

## Step 3: 問 Reason

問工程師，這個 PR 屬於哪種：

1. **bugfix** — 修 bug
2. **spec-change** — 因為 spec 改了所以改 code
3. **refactor** — 重構，不改對外行為

## Step 4: 自動收集 PR 資訊

以下資訊全部由你自動產生，不要問工程師：

### Behavior Diff（自動產生）
1. 讀取 `openspec/specs/` 下對應的 spec.md，了解功能定義
2. 跑 `git diff main` 分析程式碼變更
3. 根據 diff 內容自動整理 Before / After 行為差異

### Spec PR（自動偵測）
如果 Reason 是 spec-change：
1. 從 git remote 解析出 owner
2. 用 gh CLI 查詢最近 merge 的 spec PR：
   ```bash
   gh pr list --repo <owner>/product-specs --state merged --limit 5 --json number,title
   ```
3. 自動匹配最相關的 spec PR 編號（比對功能名稱）
4. 如果找不到，才問工程師

### Tests（自動產生）
跑 `git diff main --name-only` 找出新增或修改的 test 檔案，自動列出。

### Related Issue（自動偵測）
查詢本 repo 中對應的 spec-task issue，用來在 PR merge 時自動 close：
```bash
gh issue list --label "spec-task" --state open --json number,title,body
```
從 issue body 裡的 `featureId=<name>` 比對目前開發的功能名稱（從 branch 名或 openspec/changes/active/ 推斷）。
找到後記下 issue number，在 PR body 加上 `Closes #N`。

## Step 5: 找到對應的 spec 連結

```bash
ls openspec/specs/
```

找到相關的 spec，組出連結。

## Step 6: Commit + Push

```bash
git add -A
git commit -m "<type>: <描述>"
git push -u origin <current-branch>
```

## Step 7: 開 PR

```bash
gh pr create \
  --title "<type>: <描述>" \
  --body "## Spec
<spec 連結>

## Reason
<bugfix | spec-change | refactor>

## Spec PR (required if Reason is spec-change)
<product-specs#xxx 或 N/A>

## Behavior Diff
### Before
<根據 spec + diff 自動整理>

### After
<根據 spec + diff 自動整理>

## Tests
<自動列出新增/修改的 test 檔案>

## Closes
Closes #<偵測到的 spec-task issue number>"
```

## Step 8: 提醒 CI 檢查

告訴工程師：
- CI 會自動跑 lint + test
- CI 會檢查 `openspec/specs/` 有沒有被手動改（唯讀保護）
- 如果 Reason 是 `spec-change` 但沒填 Spec PR → CI 會失敗
- 如果改了 API routes 但 Reason 不是 `spec-change` → CI 會發出警告
