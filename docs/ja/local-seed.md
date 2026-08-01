# ローカル seed（安全なダミー）

日本語。英語版: [../en/local-seed.md](../en/local-seed.md)。

本番データをローカルに持ち込まないでください。`prisma/seed.ts` は `@faker-js/faker` で架空データのみ生成します。

## 前提

- Compose の Postgres 起動（`npm run db:up`）
- **ローカル** `DATABASE_URL`（ホストは `localhost` / `127.0.0.1` / `db` / `host.docker.internal` のみ）
- マイグレーション適用済み
- `NODE_ENV=production` では seed 拒否

## 投入

```bash
npm install
npm run db:seed
```

スクリプトは安全チェック後に関連テーブルをクリアし、デモ行を 8 件入れます。

## smoke との関係

`scripts/smoke.sh` は別の `externalId` で投入するため、seed 済みでも動作します。inbox には両方の行が混在し得ます。

## AI コンテキスト防護

`.cursorignore` で `.env*`・ダンプ等を除外。Shell からは読めるので、本番ダンプ自体を置かないこと。

## Outbound

ローカルは `OUTBOUND_MODE=mock` を維持。`http` は title/summary を `OUTBOUND_URL` へ送り、`OUTBOUND_TIMEOUT_MS`（既定 5000）で打ち切ります。

## 確認

API 起動後:

```bash
curl -s http://localhost:3000/api/v1/inbox | head
```
