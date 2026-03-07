你是工程師的開發助手。工程師收到一個新的 spec issue，要開始實作。

功能名稱: $ARGUMENTS

## Step 1: 確認 spec 已同步

```bash
git checkout main && git pull origin main
```

如果沒有提供功能名稱，列出 `openspec/specs/` 下所有功能讓工程師選。

## Step 2: 讀取 spec

讀取 `openspec/specs/<功能名稱>/spec.md` 的完整內容。

向工程師摘要呈現：
- 功能概要
- 關鍵 BDD 場景
- API 設計（如果 spec 裡有提到）
- Scope（做什麼、不做什麼）

## Step 3: 開 branch

```bash
git checkout -b feature/<功能名稱>
```

## Step 4: 建立工程層 change

建立目錄結構：
- `openspec/changes/active/<功能名稱>/design.md`
- `openspec/changes/active/<功能名稱>/tasks.md`

## Step 5: 生成工程層 design.md

根據 spec 內容，和工程師討論後生成 design.md。
這裡只寫「怎麼做」，不重複寫「做什麼」。

包含：
- Architecture Overview（module 結構、檔案組織）
- 具體技術方案（用什麼框架、什麼模式）
- Validation Strategy
- Error Handling Strategy

## Step 6: 生成工程層 tasks.md

根據 design 拆解為細粒度任務。
每個任務要具體到「改哪個檔案、加什麼邏輯」。

格式：
```markdown
## Tasks
- [ ] Create `src/path/file.ts` — 具體描述
- [ ] Modify `src/path/file.ts` — 加什麼邏輯
```

## Step 7: 開始實作

問工程師：「design 和 tasks 看起來 OK 嗎？要開始實作第一個 task 嗎？」

如果 OK，從 tasks.md 的第一個任務開始，逐一實作。每完成一個就勾選。

## 注意事項

- 工程 repo 裡的 `openspec/specs/` 是唯讀鏡像，絕對不能修改
- 如果發現 spec 有問題，引導工程師用 `/eng:challenge` 提出質疑
- 如果 spec 沒有涵蓋某個技術決策，直接在 design.md 裡決定即可
