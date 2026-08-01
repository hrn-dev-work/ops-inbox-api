# Ops Inbox API

**Upwork / クラウドワークス向け**のバックエンド・ポートフォリオ用サンプルです。  
署名付き Webhook 受信 → 冪等保存 → Ops Inbox。

調査カード **S1**（`extend`）に対応:  
`~/workspace/cursor-dotfiles/docs/ja/research-runs/2026-08-01.md`

| | |
|---|---|
| スタック | NestJS 11 · Prisma 6 · PostgreSQL 16 · OpenAPI（[ADR 0001](./docs/adr/0001-nestjs-prisma-backend.md)） |
| 課題 | プロバイダ再送でチケットが二重になる |
| いまできていること | `(provider, externalId)` 冪等 + HMAC + Swagger |
| S1 未着手 | Inbox に紐づく **outbound** モック HTTP 1本 |

English: [README.md](./README.md)  
用語・制約: [CONTEXT.md](./CONTEXT.md) · 起動手順: [docs/ja/getting-started.md](./docs/ja/getting-started.md)

起動後の docs: `http://localhost:3000/docs`

---

## ケーススタディ（応募文用）

**課題**  
SaaS は同じ Webhook を再送する。検証・冪等・API 契約が必要。

**方針**

1. `X-Signature-SHA256` で検証（生ボディの HMAC-SHA256）
2. `(provider, externalId)` で冪等 — 再送は `created: false`
3. ペイロードを `InboxItem` に正規化
4. REST + OpenAPI（`/docs`）
5. *（S1 次）* outbound モック呼び出しを 1 回記録

**非目標**  
GraphQL BFF、本番用の外部 API キーをリポに含めること、マーケ用 UI。

---

## クイックスタート

```bash
cp .env.example .env
docker compose up -d db
npm install
npx prisma migrate deploy
npm run start:dev
```

| 確認 | URL / コマンド |
|------|----------------|
| Health | `GET http://localhost:3000/api/v1/health` |
| Swagger | http://localhost:3000/docs |
| Smoke | `bash scripts/smoke.sh` |

詳細: [docs/ja/getting-started.md](./docs/ja/getting-started.md)

---

## API

| Method | Path | 用途 |
|--------|------|------|
| GET | `/api/v1/health` | アプリ + DB |
| POST | `/api/v1/webhooks/:provider` | 署名付き受信（冪等） |
| GET | `/api/v1/inbox` | 一覧 |
| PATCH | `/api/v1/inbox/:id` | ステータス更新 |
| GET | `/docs` | OpenAPI UI |

---

## S1 DoD との差分

| 項目 | 状態 |
|------|------|
| Smoke 緑 | ローカルで可 |
| OpenAPI `/docs` | あり |
| README ケース | あり（本ファイル） |
| Outbound モック | **未** |
| 公開 URL 一式 | **未** |

---

## License

MIT
