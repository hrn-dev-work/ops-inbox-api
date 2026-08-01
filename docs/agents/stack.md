# Standard stack (this repository)

**Source of truth for agents.** Override of the machine FastAPI default — see [ADR 0001](../adr/0001-nestjs-prisma-backend.md).

Research card **S1** (`extend`): `~/workspace/cursor-dotfiles/docs/en/research-runs/2026-08-01.md`

## Choices

| Layer | Choice |
|-------|--------|
| Backend | NestJS 11 + TypeScript (strict) |
| Frontend | None (API-only sample) |
| DB | PostgreSQL 16 |
| ORM / migrations | Prisma 6 |
| API shape | REST `/api/v1` + OpenAPI (Swagger UI at `/docs`) |
| Validation | class-validator + class-transformer |
| Auth | HMAC webhook signature on ingest only |
| Packages | npm |
| Tests | Jest · `scripts/smoke.sh` |
| Hosting | Render or Railway (API) + GitHub |

## Environment

| Concern | Default |
|---------|---------|
| Local DB | PostgreSQL 16 in Docker Compose (`db`) — use `docker-compose.yml` |
| Redis | Off (queue later only with ADR) |
| Local ports | API `3000` · Postgres `5432` |
| Health | `GET /api/v1/health` |
| Env files | `.env` gitignored; `.env.example` key names only |
| Agent host | WSL Ubuntu |

## Layout

```
src/         # NestJS modules (webhooks, inbox, health, prisma)
prisma/      # schema + migrations
docs/        # agents (EN) · en/ · ja/ · adr/
scripts/     # smoke.sh
```

## Exceptions

1. User confirms the exception  
2. Add an ADR under `docs/adr/`  
3. Update this file and `CONTEXT.md`
