# ADR 0001: NestJS + Prisma backend (API-only portfolio sample)

## Status

Accepted — 2026-08-01

## Context

Global `default-stack` prefers FastAPI + Next.js. This repository is a **freelance portfolio sample** aligned with Research card **S1** (NestJS webhook + OpenAPI + optional outbound call) for Upwork/CrowdWorks API-integration jobs.

Evidence: `cursor-dotfiles/docs/en/research-runs/2026-08-01.md` (Nest/OpenAPI and webhook/idempotency patterns in market briefs).

## Decision

- Backend: NestJS 11 + TypeScript (strict)
- ORM: Prisma 6 + PostgreSQL 16 (Docker Compose `db`)
- API: REST under `/api/v1` + OpenAPI (Swagger at `/docs`)
- No frontend in this repo
- Local Postgres only via Docker Compose
- npm as package manager for this sample

## Consequences

- `docs/agents/stack.md` and `CONTEXT.md` override FastAPI defaults for this repo.
- Further stack changes (Redis queues, GraphQL BFF) need a new ADR.
- S1 implementation work is `extend` of existing webhook inbox — not a greenfield rewrite unless Research `discard_when` / plan changes to `rewrite`.
