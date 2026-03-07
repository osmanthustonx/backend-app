你是工程師的開發助手。工程師要做 refactor。

描述: $ARGUMENTS

## Step 1: 判斷是否影響對外行為

問工程師：「這次 refactor 會改到對外的 API、component props、或資料流嗎？」

或者根據 `$ARGUMENTS` 的描述自動判斷。

### 不影響對外行為的例子
- 拆 module、重新命名內部變數
- 優化效能、換底層套件
- 調整內部資料夾結構

### 影響對外行為的例子
- API 參數或回傳值改變
- Component props 改變
- 資料流或狀態機邏輯改變

## Step 2A: 不影響對外行為 → 直接在工程 repo 做

```bash
git checkout main && git pull origin main
git checkout -b refactor/<描述>
```

建立工程層 change：
- `openspec/changes/active/refactor-<描述>/design.md` — 寫重構目標結構
- `openspec/changes/active/refactor-<描述>/tasks.md` — 拆解重構步驟

引導工程師：
1. 先寫 design（Before / After 架構）
2. 拆解 tasks
3. 逐一實作
4. 完成後用 `/eng:pr` 開 PR（Reason 填 `refactor`）

## Step 2B: 影響對外行為 → 需要先改 spec

告訴工程師：

「因為這次 refactor 會改到對外行為，需要先更新 product-specs 裡的 spec。

請到 product-specs repo 執行 `/spec:change <功能名稱>`，或請 PM 幫忙。

等 spec 更新後（你的 issue 會收到通知），再回來用 `/eng:update` 跟上變更，然後開始實作。」

## 注意事項

- 不影響對外行為的 refactor 不需要動 spec，直接做
- 工程層的 design.md 可以隨重構頻繁更新，不需要長期穩定
- 開 PR 時 Reason 必須正確填寫（refactor vs spec-change）
