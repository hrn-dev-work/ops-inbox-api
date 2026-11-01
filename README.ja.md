# Ops Inbox API（日本語）

[English](./README.md) | [日本語](./README.ja.md)

**Upwork / クラウドワークス向け**のバックエンド・ポートフォリオ用サンプルです。\
署名付き Webhook 受信 → 冪等保存 → Ops Inbox。

調査カード **S1**（`extend`）に対応:\
[docs/ja/sample-card-s1.md](./docs/ja/sample-card-s1.md)\
調査ラン全文（private）: https://github.com/hrn-dev-work/cursor-dotfiles/blob/main/docs/ja/research-runs/2026-08-01.md

| | |
|---|---|
| スタック | NestJS 11 · Prisma 6 · PostgreSQL 16 · OpenAPI（[ADR 0001](./docs/adr/0001-nestjs-prisma-backend.md)） |
| 課題 | プロバイダ再送でチケットが二重になる |
| いまできていること | HMAC + 冪等受信 + outbound モック + Swagger + ホスト API |
| 公開 API | [https://ops-inbox-api.onrender.com](https://ops-inbox-api.onrender.com)（[/docs](https://ops-inbox-api.onrender.com/docs)）— Render · [docs/ja/deploy-render.md](./docs/ja/deploy-render.md) |

目的: [docs/ja/purpose.md](./docs/ja/purpose.md) · 用語・制約: [CONTEXT.md](./CONTEXT.md) · 規約: [docs/ja/conventions.md](./docs/ja/conventions.md) · 起動手順: [docs/ja/getting-started.md](./docs/ja/getting-started.md)

ローカル docs: `http://localhost:3000/docs` · ホスト: [https://ops-inbox-api.onrender.com/docs](https://ops-inbox-api.onrender.com/docs)

---

## ケーススタディ（応募文用）

**課題**\
SaaS は同じ Webhook を再送する。検証・冪等・API 契約が必要。

**方針**

1. `X-Signature-SHA256` で検証（生ボディの HMAC-SHA256）
2. `(provider, externalId)` で冪等 — 再送は `created: false`
3. ペイロードを `InboxItem` に正規化
4. 初回作成時のみ outbound 通知を 1 回記録（既定 `OUTBOUND_MODE=mock`）
5. REST + OpenAPI（`/docs`）；inbox 一覧に `outboundCalls` を含む

**非目標**\
GraphQL BFF、本番用の外部 API キーをリポに含めること、マーケ用 UI。

---

## クイックスタート

```bash
cp .env.example .env
docker compose up -d db
npm install
npx prisma migrate deploy
npm run db:seed   # 任意: Faker デモデータ
npm run start:dev
```

| 確認 | URL / コマンド |
|------|----------------|
| Health | `GET http://localhost:3000/api/v1/health` |
| Swagger | http://localhost:3000/docs |
| Smoke | `bash scripts/smoke.sh` |
| Seed | `npm run db:seed`（[docs/ja/local-seed.md](./docs/ja/local-seed.md)） |
| Secret audit | `npm run secret:audit` |
| CI | `.github/workflows/ci.yml`（`secret-audit` → lint + test） |

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

## スキルセット

このサンプルが示すスキル（調査カード **S1**・[docs/agents/stack.md](./docs/agents/stack.md) に準拠）。

| 領域 | スキル |
|------|--------|
| バックエンド | NestJS 11 · TypeScript（strict）· Nest モジュール構成 |
| API | REST `/api/v1` · OpenAPI / Swagger（`/docs`）· DTO バリデーション（`class-validator`） |
| データ | PostgreSQL 16 · Prisma 6 · マイグレーション · unique 制約による冪等 |
| 連携 | HMAC-SHA256 Webhook 検証 · `(provider, externalId)` 冪等受信 · outbound HTTP 通知（既定はモック） |
| ドメイン | Webhook → Inbox 正規化 · severity / status ライフサイクル |
| 品質 | Jest 単体テスト · `scripts/smoke.sh` · health + DB ping · `scripts/secret-audit.sh` |
| ローカル運用 | Docker Compose の Postgres · `.env` / `.env.example` · `.cursorignore` · Faker seed（ローカルホストガード） |

**調査タグ（S1）:** `nestjs` · `prisma` · `rest-api` · `openapi` · `webhook` · `outbound-integration` · `testing`

**このサンプルの非対象:** GraphQL BFF · React/Next UI · Redis · 本番用の外部 API 認証情報

このリポ作業時のエージェント用スキル／ルール／hooks 一覧: [docs/agents/skill-set.md](./docs/agents/skill-set.md)（英語・エージェント向け）。\
規約ハンドブック: [docs/ja/conventions.md](./docs/ja/conventions.md) · エージェント正本: [docs/agents/conventions.md](./docs/agents/conventions.md)。

コミット前ゲート: エージェントに **implementation-review** を実行させる（[docs/reviews/latest.md](./docs/reviews/latest.md) に出力）。

---

## S1 DoD との差分

| 項目 | 状態 |
|------|------|
| Smoke 緑 | Yes（ローカル + ホスト） |
| OpenAPI `/docs` | あり（ローカル + [ホスト](https://ops-inbox-api.onrender.com/docs)） |
| README ケース | あり（本ファイル） |
| Outbound モック | あり（inbox の `outboundCalls`） |
| 公開 URL 一式 | Yes — [https://ops-inbox-api.onrender.com](https://ops-inbox-api.onrender.com) · GitHub あり |

---

## License

MIT
