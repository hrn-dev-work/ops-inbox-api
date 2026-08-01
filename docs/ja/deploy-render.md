# Render へのデプロイ（S1 公開 API）

日本語。英語: [../en/deploy-render.md](../en/deploy-render.md)。  
エージェント規約: [../agents/conventions.md](../agents/conventions.md)。

このサンプルは **Render Blueprint**（[render.yaml](../../render.yaml)）で、無料 Web + 無料 Postgres を定義します。

## 無料枠の制約

| 制約 | 影響 |
|------|------|
| Web のアイドル停止（約15分） | 起床に最大約1分かかることがある |
| Free Postgres は **作成から30日** | デモ用。長期はアップグレードまたは再作成 |
| ワークスペースあたり Free DB は1つ | 作成失敗時は未使用 DB を削除 |

## 前提

- GitHub: `https://github.com/hrn-dev-work/ops-inbox-api`
- Render アカウントが GitHub 連携済み
- `main` に `render.yaml` があること

## Blueprint デプロイ

1. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. このリポ・ブランチ `main` を選択
3. Blueprint パス `render.yaml` を確認
4. **Deploy Blueprint**

作成されるもの:

- Postgres `ops-inbox-db`
- Web `ops-inbox-api`（HTTPS `*.onrender.com`）

起動ビルド: `npm ci --include=dev && npx prisma generate && npm run build`  
（`NODE_ENV=production` でも Nest / Prisma CLI を入れるため `--include=dev` 必須）  
起動時: `npm run start:render`（`prisma migrate deploy` → `node dist/src/main.js`）。

## 環境変数

| キー | 由来 |
|------|------|
| `DATABASE_URL` | Render Postgres の接続文字列 |
| `WEBHOOK_SIGNING_SECRET` | 自動生成 — Dashboard の Environment からコピー |
| `OUTBOUND_MODE` | `mock` |
| `NODE_ENV` | `production` |

秘密を git に書かない。Render 向けに `db:seed` は実行しない（ローカル専用ガードあり）。

## 確認

```bash
export BASE_URL="https://<service-name>.onrender.com"
export WEBHOOK_SIGNING_SECRET="<Dashboardの値>"
bash scripts/smoke.sh
```

- Health: `GET $BASE_URL/api/v1/health`
- Swagger: `$BASE_URL/docs`

## URL 確定後

`README.md` / `README.ja.md` の S1 DoD（公開 URL）と [../agents/conventions.md](../agents/conventions.md) を更新する。
