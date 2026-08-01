# はじめに（Ops Inbox API）

日本語ガイド。用語・制約は [`CONTEXT.md`](../../CONTEXT.md)（英語・エージェント向け）。  
調査カード S1: `cursor-dotfiles/docs/ja/research-runs/2026-08-01.md`

## 前提

- Node.js 20+
- Docker（PostgreSQL 16 は Compose）
- Windows では WSL Ubuntu 推奨

## 手順

```bash
cp .env.example .env   # 必要なら
docker compose up -d db
npm install
npx prisma migrate deploy
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Health: `GET /api/v1/health`
- Smoke: `bash scripts/smoke.sh`
