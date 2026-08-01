# Project conventions

English human handbook. Agent SSOT (full detail): [../agents/conventions.md](../agents/conventions.md).  
Japanese: [../ja/conventions.md](../ja/conventions.md).

This page summarizes how we work in **ops-inbox-api**, including recent safety and quality improvements.

---

## Documentation language

- `README.md` + `docs/en/` → English only  
- `README.ja.md` + `docs/ja/` → Japanese only  
- Agent files (`CONTEXT.md`, `docs/agents/`, ADRs, Cursor rules) → English only  
- Never mix EN and JA in one file

---

## Stack

NestJS 11 · Prisma 6 · PostgreSQL 16 (Docker Compose) · REST + OpenAPI.  
See [ADR 0001](../adr/0001-nestjs-prisma-backend.md) and [agents/stack.md](../agents/stack.md).

---

## Core product rules

- Webhook HMAC verification; idempotent ingest on `(provider, externalId)`
- Controllers stay thin; services own business logic
- Default outbound is **mock** (no real third-party keys in git)

---

## Safety (PII / secrets / AI context)

| Practice | How |
|----------|-----|
| Ignore secrets/dumps for Cursor | Root `.cursorignore` |
| Ignore for git | `.gitignore` (aligned dumps/keys/logs) |
| Local demo data | `npm run db:seed` (Faker only; blocks remote DB / production) |
| Logging | Ids only — not raw payloads or customer PII |
| Secret scan | `npm run secret:audit`; optional `bash scripts/install-git-hooks.sh` |
| Outbound HTTP | Timeout via `OUTBOUND_TIMEOUT_MS`; prefer mock locally |

Details: [local-seed.md](./local-seed.md) · [agents/security.md](../agents/security.md)

---

## Quality gates

| Gate | Command / artifact |
|------|-------------------|
| Lint + unit tests | `npm run lint` · `npm test` |
| Secret audit | `npm run secret:audit` |
| Smoke (API running) | `bash scripts/smoke.sh` |
| Pre-commit review (optional, thorough) | Ask agent: **implementation-review** → [../reviews/latest.md](../reviews/latest.md) |
| CI | `.github/workflows/ci.yml` — secret-audit, then lint + test |

Reviews explainer: [reviews.md](./reviews.md)

---

## Skills & agent routing

- Human skill table: [README.md](../../README.md) § Skill set  
- Agent inventory: [agents/skill-set.md](../agents/skill-set.md)  
- Cursor router: `.cursor/rules/project-entry.mdc`

---

## Still open (S1)

Hosted **public API URL** — deploy with [deploy-render.md](./deploy-render.md), then mark DoD Yes after live smoke.

---

## Related guides

- [Getting started](./getting-started.md)
- [Deploy on Render](./deploy-render.md)
- [Local database](./local-database.md)
- [Local seed](./local-seed.md)
- [Reviews](./reviews.md)
- [Sample card S1](./sample-card-s1.md)
