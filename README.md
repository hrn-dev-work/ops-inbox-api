# Ops Inbox API

[English](./README.md) | [日本語](./README.ja.md)

Portfolio sample for **Upwork / CrowdWorks-style** backend work: signed webhook ingest → idempotent storage → ops inbox.

Aligned with Research card **S1** (`extend`):  
[docs/en/sample-card-s1.md](./docs/en/sample-card-s1.md)  
Full research run (private): https://github.com/hrn-dev-work/cursor-dotfiles/blob/main/docs/en/research-runs/2026-08-01.md

| | |
|---|---|
| Stack | NestJS 11 · Prisma 6 · PostgreSQL 16 · OpenAPI ([ADR 0001](./docs/adr/0001-nestjs-prisma-backend.md)) |
| Problem | Providers retry webhooks; naive handlers create duplicate tickets |
| Result so far | HMAC + idempotent ingest + outbound mock + Swagger + hosted API |
| Public API | [https://ops-inbox-api.onrender.com](https://ops-inbox-api.onrender.com) ([/docs](https://ops-inbox-api.onrender.com/docs)) — Render; deploy: [docs/en/deploy-render.md](./docs/en/deploy-render.md) |

Why this repo: [docs/en/purpose.md](./docs/en/purpose.md) · Agent glossary: [CONTEXT.md](./CONTEXT.md) · Conventions: [docs/en/conventions.md](./docs/en/conventions.md) · Human setup: [docs/en/getting-started.md](./docs/en/getting-started.md)

Local docs: `http://localhost:3000/docs` · Hosted: [https://ops-inbox-api.onrender.com/docs](https://ops-inbox-api.onrender.com/docs)

---

## Case study (for proposals)

**Challenge**  
SaaS tools retry the same webhook. Clients need verified ingest, no duplicate tickets, and a clear API contract.

**Approach**

1. Verify `X-Signature-SHA256` (HMAC-SHA256 of the raw body)
2. Idempotent upsert by `(provider, externalId)` — retries return `created: false`
3. Map payload → `InboxItem` (title / summary / severity / status)
4. On first create only: record one outbound notify (`OUTBOUND_MODE=mock` by default)
5. Expose REST + OpenAPI (`/docs`); inbox list includes `outboundCalls`

**Non-goals**  
GraphQL BFF, real third-party production API keys in the repo, marketing UI.

---

## Quick start

```bash
cp .env.example .env
docker compose up -d db
npm install
npx prisma migrate deploy
npm run db:seed   # optional Faker demo data
npm run start:dev
```

| Check | URL / command |
|-------|----------------|
| Health | `GET http://localhost:3000/api/v1/health` |
| Swagger | http://localhost:3000/docs |
| Smoke | `bash scripts/smoke.sh` |
| Seed | `npm run db:seed` ([docs/en/local-seed.md](./docs/en/local-seed.md)) |
| Secret audit | `npm run secret:audit` |
| CI | `.github/workflows/ci.yml` (`secret-audit` → lint + test) |

More detail: [docs/en/getting-started.md](./docs/en/getting-started.md)

---

## API surface

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/health` | App + DB |
| POST | `/api/v1/webhooks/:provider` | Signed ingest (idempotent) |
| GET | `/api/v1/inbox` | List (`?status=&severity=`) |
| PATCH | `/api/v1/inbox/:id` | Update status |
| GET | `/docs` | OpenAPI UI |

---

## Offer blurb (EN, draft)

> I build NestJS APIs for webhook and third-party integrations: HMAC verification, idempotent retries, a recorded outbound notify, Prisma/Postgres, and OpenAPI. Demo: this repo — ingest twice with the same `externalId` and get one inbox item plus one outbound call.

---

## Skill set

Skills this sample demonstrates (aligned with Research card **S1** and [docs/agents/stack.md](./docs/agents/stack.md)).

| Area | Skills |
|------|--------|
| Backend | NestJS 11 · TypeScript (strict) · modular Nest architecture |
| API | REST `/api/v1` · OpenAPI / Swagger (`/docs`) · DTO validation (`class-validator`) |
| Data | PostgreSQL 16 · Prisma 6 · migrations · unique constraint idempotency |
| Integrations | HMAC-SHA256 webhook verify · idempotent ingest `(provider, externalId)` · outbound HTTP notify (mock by default) |
| Domain | Webhook → Inbox normalization · severity / status lifecycle |
| Quality | Jest unit tests · `scripts/smoke.sh` · health + DB ping · `scripts/secret-audit.sh` |
| Local ops | Docker Compose Postgres · `.env` / `.env.example` · `.cursorignore` · Faker seed (local-host guard) |

**Research tags (S1):** `nestjs` · `prisma` · `rest-api` · `openapi` · `webhook` · `outbound-integration` · `testing`

**Not in scope for this sample:** GraphQL BFF · React/Next UI · Redis · real third-party production credentials

Agent skills / rules / hooks used when working this repo: [docs/agents/skill-set.md](./docs/agents/skill-set.md) (English, agents only).  
Full conventions handbook: [docs/en/conventions.md](./docs/en/conventions.md) · agents: [docs/agents/conventions.md](./docs/agents/conventions.md).

Pre-commit gate: ask the agent to run **implementation-review** (writes [docs/reviews/latest.md](./docs/reviews/latest.md)).

---

## Status vs S1 DoD

| DoD item | Status |
|----------|--------|
| Smoke tests green | Yes (local + hosted) |
| OpenAPI `/docs` | Yes (local + [hosted](https://ops-inbox-api.onrender.com/docs)) |
| README case study | Yes (this file) |
| Outbound mock call | Yes (`OUTBOUND_MODE=mock`, see inbox `outboundCalls`) |
| Public URL set (hosted API + GitHub) | Yes — [https://ops-inbox-api.onrender.com](https://ops-inbox-api.onrender.com) · GitHub yes |

---

## License

MIT
