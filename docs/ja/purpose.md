# このリポジトリの目的

## 一文

これは **エンドユーザー向け製品ではなく、公開ポートフォリオ用デモ** です。  
クライアントがクリックして確認できる **NestJS の Webhook 受信 API** を作れる、という証拠になります。

## ビジネス上の目的

次のような **単発・固定報酬** の案件応募を支えるためです。

- [Upwork](https://www.upwork.com/)
- [クラウドワークス](https://crowdworks.jp/) など国内マーケット

想定される案件の言い方:

> 「プロバイダから署名付き Webhook を受け、再送でも二重保存しない。小さな REST + OpenAPI を出し、必要なら別システムへ一度だけ通知する。」

応募で見せるものは長い経歴ではなく **証拠** です。

| 証拠 | 場所 |
|------|------|
| ソース + ケーススタディ | この GitHub リポ + ルート `README.md` |
| 動く API | [https://ops-inbox-api.onrender.com](https://ops-inbox-api.onrender.com) · [OpenAPI `/docs`](https://ops-inbox-api.onrender.com/docs) |
| 自動確認 | `scripts/smoke.sh`（ローカル Docker + ホスト） |
| 調査カード | [sample-card-s1.md](./sample-card-s1.md)（id **S1**） |

戦略・調査の private バックアップ（アプリ実行には不要）:  
`cursor-dotfiles` の `docs/ja/portfolio-automation-strategy.md` と調査ラン `2026-08-01`。

## 査読者が 60 秒で分かること

1. **受信:** `POST /api/v1/webhooks/:provider` + `X-Signature-SHA256`（生ボディの HMAC）
2. **冪等:** 同じ `(provider, externalId)` を 2 回 → inbox は 1 件。2 回目は `created: false`
3. **形:** 主 API は正規化した `InboxItem`（title / summary / severity / status）
4. **外向き:** **初回作成時のみ** notify を 1 回記録（既定 `OUTBOUND_MODE=mock` — 本番キーを git に入れない）
5. **契約:** `/docs` の Swagger

## 応募用の具体デモ手順

1. [ホストの `/docs`](https://ops-inbox-api.onrender.com/docs) を開く
2. 同じ `externalId` の署名付き Webhook を 2 回送る
3. `GET /api/v1/inbox` → **1 件**、`outboundCalls` は **1**（2 にならない）
4. README のケーススタディと公開リポ URL を添える

ローカル: [getting-started.md](./getting-started.md) + `bash scripts/smoke.sh`

## 誰向けか / 誰向けでないか

| 対象 | 役割 |
|------|------|
| 案件の査読者・クライアント | 主対象 — ライブデモでスキルを判断する |
| 運用者（自分）とコーディングエージェント | 「なぜこのリポがあるか」と DoD の意味を共有する |
| 本物の Ops 製品のエンドユーザー | **対象外** — 製品 UI やマルチテナント SaaS ではない |

## 明示的な非目標

- GraphQL BFF、React/Next のマーケ UI
- 本番用の外部 API キーを git にコミットすること
- サンプル API 面を超えたフル CRM / チケット製品

## DoD（S1）

README の「S1 DoD」表と [sample-card-s1.md](./sample-card-s1.md): smoke 緑、OpenAPI `/docs`、README ケース、outbound モック、公開 URL（ホスト API + GitHub）。

English: [../en/purpose.md](../en/purpose.md)
