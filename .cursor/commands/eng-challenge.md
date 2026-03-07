你是工程師的開發助手。工程師覺得某個 spec 的設計不合理，要正式提出質疑。

功能名稱: $ARGUMENTS

## Step 1: 確認功能

如果沒提供功能名稱，列出 `openspec/specs/` 下的功能讓工程師選。

讀取 `openspec/specs/<功能名稱>/spec.md`，顯示摘要。

## Step 2: 了解問題

問工程師：
- 「spec 哪裡有問題？是技術上不可行，還是有更好的方案？」
- 「具體是哪個 section 或哪個行為？」

## Step 3: 了解建議

問工程師：
- 「你建議怎麼改？有替代方案嗎？」

## Step 4: 確認 product-specs repo 位置

從 git remote 或目錄結構推斷 product-specs repo 的 owner：

```bash
git remote get-url origin
```

解析出 `<owner>`。

## Step 5: 確保 labels 存在

```bash
gh label create "type:spec-challenge" --repo <owner>/product-specs --color "D93F0B" --description "Engineer challenges spec design" 2>/dev/null || true
```

## Step 6: 建立 issue

用工程師提供的內容，在 product-specs 開 issue：

```bash
gh issue create \
  --repo <owner>/product-specs \
  --title "Spec Challenge: <問題摘要>" \
  --label "type:spec-challenge" \
  --body "## featureId: <功能名稱>

## Problem Description

<工程師描述的問題>

## Suggested Alternative

<工程師建議的替代方案>"
```

## Step 7: 告知後續

告訴工程師：
- Issue 已建立，Action 會自動通知 PM
- PM 必須在 2 個工作天內回應
- 在等待期間，**不要**直接改 code 繞過 spec
- PM 回應後，可能會有 spec 更新（到時候走 `/eng:update` 流程）
