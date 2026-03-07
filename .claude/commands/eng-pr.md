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

## Step 4: 收集 PR 資訊

### 如果是 spec-change
問：「對應的 spec PR 編號是什麼？（例如 product-specs#123）」

### 所有情況都要問
- 「改之前的行為是什麼？」（Before）
- 「改之後的行為是什麼？」（After）
- 「新增或修改了哪些測試？」

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
<改之前的行為>

### After
<改之後的行為>

## Tests
<新增/修改的測試>"
```

## Step 8: 提醒 CI 檢查

告訴工程師：
- CI 會自動跑 lint + test
- CI 會檢查 `openspec/specs/` 有沒有被手動改（唯讀保護）
- 如果 Reason 是 `spec-change` 但沒填 Spec PR → CI 會失敗
- 如果改了 API routes 但 Reason 不是 `spec-change` → CI 會發出警告
