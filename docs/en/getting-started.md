# Getting started (Ops Inbox API)

English human guide. Agent glossary: [`CONTEXT.md`](../../CONTEXT.md). Conventions: [conventions.md](./conventions.md).  
Research card **S1** (`extend`): [sample-card-s1.md](../en/sample-card-s1.md) · private run: https://github.com/hrn-dev-work/cursor-dotfiles/blob/main/docs/en/research-runs/2026-08-01.md

## Prerequisites

- Node.js 20+
- Docker (PostgreSQL 16 via Compose)
- WSL Ubuntu recommended on Windows

## Steps

```bash
cp .env.example .env   # if needed
docker compose up -d db
npm install
npx prisma migrate deploy
npm run db:seed          # optional: Faker demo rows (never production data)
npm run start:dev
```

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Health: `GET /api/v1/health`
- Smoke: `bash scripts/smoke.sh`
- Local seed details: [local-seed.md](./local-seed.md)
- AI context exclusions: root `.cursorignore`
- Secret audit: `npm run secret:audit` (optional hooks: `bash scripts/install-git-hooks.sh`)
