# ops-inbox-api

NestJS portfolio sample: **idempotent webhook ingest → ops inbox → one outbound notify** (mock by default) per Research card **S1** (`extend`).

Strategy (private GitHub): https://github.com/hrn-dev-work/cursor-dotfiles/blob/main/docs/en/portfolio-automation-strategy.md  
Research card S1 (in-repo): [docs/en/sample-card-s1.md](docs/en/sample-card-s1.md)  
Research run (private GitHub): https://github.com/hrn-dev-work/cursor-dotfiles/blob/main/docs/en/research-runs/2026-08-01.md

**Agents:** read this file + `docs/agents/` before non-trivial work.

---

## Domain Language

**WebhookEvent**:
Raw delivery from an external provider. Uniqueness is `(provider, externalId)` so retries are idempotent.
_Avoid_: treating every HTTP POST as a new business event

**InboxItem**:
Normalized ops work item derived from a WebhookEvent (title, summary, severity, status).
_Avoid_: exposing raw provider payloads as the primary API surface

**Provider**:
Logical source system name (e.g. `stripe`, `github`). Path param on ingest.
_Avoid_: hard-coding one vendor in domain services

**OutboundCall**:
Record of one mock/real HTTP call triggered after first ingest (url, status, correlation to InboxItem).
_Avoid_: calling real third-party APIs with committed secrets

**Signing secret**:
Shared HMAC secret (`WEBHOOK_SIGNING_SECRET`) for `X-Signature-SHA256`.
_Avoid_: trusting unsigned bodies outside local demo

---

## Relationships

- 1 WebhookEvent → 0..1 InboxItem  
- 1 InboxItem → 0..n OutboundCall (created on first ingest when S1 outbound enabled)  
- InboxItem.status: OPEN → ACKED → CLOSED  

---

## System Architecture & Constraints

| Layer | Choice |
|-------|--------|
| Backend | NestJS 11, TypeScript strict (**ADR 0001**) |
| DB | PostgreSQL 16 via Docker Compose `db` |
| ORM | Prisma 6 |
| API | REST `/api/v1` + OpenAPI (`/docs`) |
| Validation | class-validator / class-transformer |
| Auth | Webhook HMAC on ingest only (v1) |
| Packages | npm (Nest default; pnpm not required for this sample) |
| Tests | Jest · smoke script |
| Hosting target | Render/Railway for API; repo on GitHub |

**Ports:** API `3000` · Postgres `5432` · Health `GET /api/v1/health` · Docs `GET /docs`

Layout: Nest `src/` · `prisma/` · `docs/` · `scripts/smoke.sh`

Full detail: [docs/agents/stack.md](docs/agents/stack.md). ADR: [0001](docs/adr/0001-nestjs-prisma-backend.md).

---

## Common Ambiguities

- Duplicate webhooks return existing InboxItem with HTTP 200 (`created: false`), not 409.
- Invalid signature → 401; malformed body → 400.
- S1 outbound uses a **mock upstream** by default (no real API keys in git).

---

## Security Guardrails

See [docs/agents/security.md](docs/agents/security.md).

- Validate DTOs at HTTP boundary.
- Never log full secrets; do not commit `.env`.
- No real third-party production credentials in the sample.
- Prefer `.cursorignore` + Faker seeds for local data; never load production dumps into Compose Postgres for demos.
- Seed refuses non-local `DATABASE_URL` and `NODE_ENV=production` (`assertSafeSeedDatabaseUrl`).
- Do not log raw webhook payloads or customer PII; log ids only.
- Secret gate: `bash scripts/secret-audit.sh` / CI workflow `secret-audit`.
