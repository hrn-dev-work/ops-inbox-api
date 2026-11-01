# Project conventions (ops-inbox-api)

**English only (agent SSOT).** Human summaries: [../en/conventions.md](../en/conventions.md) · [../ja/conventions.md](../ja/conventions.md).

This file consolidates **all** standing conventions for this repository — including improvements added for skill inventory, implementation-review, PII/local-data safety, secret audit, and CI. Prefer this index; follow linked docs for depth. Do not invent alternate stacks without an ADR.

---

## 1. How to read docs (`docs-language`)

| Audience | Where | Language |
|----------|-------|----------|
| Agents (Cursor, Gemini, …) | `CONTEXT.md`, `docs/agents/*`, `docs/adr/*`, `.cursor/rules/*` | **English only** |
| Humans (EN) | `README.en.md`, `docs/en/*` | English only |
| Humans (JA) | `README.md`, `docs/ja/*` | Japanese only |

- One locale per file. Never EN + JA in the same markdown file.
- Same topic ⇒ parallel paths (`docs/en/foo.md` ↔ `docs/ja/foo.md`).
- Policy skill: `docs-language` (`~/.cursor/skills/docs-language/SKILL.md`).

**Agent read order:** [README.md](./README.md) in this directory.

---

## 2. Stack & architecture

| Item | Rule |
|------|------|
| SSOT | [stack.md](./stack.md) |
| Exception | NestJS + Prisma vs machine FastAPI default → [ADR 0001](../adr/0001-nestjs-prisma-backend.md) |
| API | REST `/api/v1` + OpenAPI at `/docs` |
| DB | PostgreSQL **16** via Docker Compose `db` only (no host apt Postgres for app data) |
| Redis / GraphQL BFF / React UI | Out of scope unless new ADR |

Domain terms: root [`CONTEXT.md`](../../CONTEXT.md). Consumer rules: [domain.md](./domain.md).

---

## 3. Domain behavior (non-negotiable)

| Concern | Rule |
|---------|------|
| Idempotency | Unique `(provider, externalId)`; retries → HTTP 200 + `created: false` (not 409) |
| Auth on ingest | HMAC-SHA256 (`X-Signature-SHA256`) via `WEBHOOK_SIGNING_SECRET` |
| Layers | Controllers = I/O; business rules in services; Prisma not in controllers |
| Outbound | Default `OUTBOUND_MODE=mock`; record `OutboundCall` on first create only |
| Invalid signature | 401; malformed body | 400 |

---

## 4. Security, PII, and local data

Full detail: [security.md](./security.md).

| Control | Convention |
|---------|------------|
| Secrets in git | Never. `.env` gitignored; `.env.example` keys / dummy values only |
| AI context | Root [`.cursorignore`](../../.cursorignore) blocks `.env*`, keys, logs, dumps (`*.sql`/`*.csv`, …). **Shell/MCP are not blocked** — keep real secrets out of the tree |
| Ignore sync | Keep [`.gitignore`](../../.gitignore) and [`.cursorignore`](../../.cursorignore) **exception lists aligned** (e.g. `*.sql` + `!prisma/migrations/**/*.sql`). Drift hides migration SQL from agents while git still tracks it |
| Git ignore | [`.gitignore`](../../.gitignore) aligned for dumps/logs/keys |
| Logging | Correlation ids only (`provider`, `externalId`, `inboxItemId`). No raw webhook `payload` / seeded email/phone in logs |
| Seed | `npm run db:seed` → `prisma/seed.ts` + `@faker-js/faker` only. **No hardcoded PII** |
| Seed safety | `assertSafeSeedDatabaseUrl` — allowlist `localhost` / `127.0.0.1` / `::1` / `db` / `host.docker.internal`; refuse `NODE_ENV=production` |
| Outbound HTTP | `OUTBOUND_TIMEOUT_MS` (default 5000) via `AbortSignal.timeout`; prefer `mock` locally; `http` sends title/summary to `OUTBOUND_URL` |
| Secret scan | `npm run secret:audit` · optional `bash scripts/install-git-hooks.sh` · CI gitleaks + Trivy |
| Config | `.gitleaks.toml`, `.trivyignore` |

Human seed guide: [../en/local-seed.md](../en/local-seed.md).

---

## 5. Quality gates

### 5.1 Before commit (human or agent)

1. Optional but recommended: **implementation-review** (7 sequential stages)  
   - Rule: `.cursor/rules/implementation-review.mdc`  
   - Trigger phrase: `Run implementation-review` / 「implementation-review を実行して」 (Agent MUST read `.cursor/rules/implementation-review.mdc`)  
   - Output: [../reviews/latest.md](../reviews/latest.md)  
   - Stages: Scout → Tooling → Validator → Architect → DBA → SRE → Writer/SDET  
   - **Do not skip stages.** FAIL ⇒ fix or ask; do not commit on FAIL.
2. Local checks (also CI): `npm run lint` · `npm test` · `npm run secret:audit`
3. Prisma: `npx prisma validate` when schema/migrations change
4. Smoke (API up): `bash scripts/smoke.sh`

### 5.1.1 Hosted DoD closeout (atomic)

When a public URL or hosted verification status changes, **one commit** (or one PR) must update all of:

| Artifact | Update |
|----------|--------|
| `README.md` + `README.en.md` | DoD table + public URL row |
| [conventions.md](./conventions.md) (this file) + `docs/en\|ja/conventions.md` | Hosted status (not “still open”) |
| Deploy guide (`docs/en\|ja/deploy-render.md` or equivalent) | Real `BASE_URL` example; remove stale “mark DoD Yes” TODOs |
| `docs/implementation-retrospective.md` | Evidence: health, smoke command outcome, date |
| `CONTEXT.md` | Hosting target / live URL if the sample ships hosted |

**If:** hosted smoke has not passed, **Then:** do not mark Public URL DoD **Yes**.  
**If:** smoke needs a generated secret, **Then:** read it from the host Dashboard env — never commit it.  
**If:** `implementation-review` was not run, **Then:** leave `docs/reviews/latest.md` as placeholder (do not invent sign-offs).

### 5.2 CI

Workflow: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)

| Job | What |
|-----|------|
| `secret-audit` | `scripts/secret-audit.sh` + gitleaks-action + Trivy secret |
| `lint-and-test` | needs secret-audit → `npm ci` → `prisma generate` → lint → Jest |

### 5.3 Git hooks (local)

```bash
bash scripts/install-git-hooks.sh   # sets core.hooksPath=.githooks
```

Pre-commit runs `scripts/pre-commit-secret-check.sh`.

### 5.4 Tests

- Framework: Jest (`testing-istqb.mdc` for design)
- Unit: `src/**/*.spec.ts`
- Smoke: `scripts/smoke.sh` (unique `externalId`; OK alongside seeded rows)

---

## 6. Cursor rules, skills, hooks

Inventory: [skill-set.md](./skill-set.md). Router: `.cursor/rules/project-entry.mdc`.

| Kind | Location | Notes |
|------|----------|-------|
| Project rules | `.cursor/rules/*.mdc` | `implementation-review` is **on-demand**, not every edit |
| Global rules | `~/.cursor/rules/` | WSL canonical; sync to Windows via `sync-global-cursor-rules.sh` |
| Skills | `~/.cursor/skills/` | `docs-language`, `wsl-agent-invoke`, … |
| User `sessionStart` | `~/.cursor/hooks/ensure-project-bootstrapped.sh` | Auto foundation if CONTEXT/project-entry missing; may open hook tab in UI — leave enabled unless user asks |
| Repo hooks | `.cursor/hooks/*` | edit tracking + stop retrospective |

---

## 7. Documentation & portfolio surfaces

| Surface | Convention |
|---------|------------|
| Skill tables | README.md + README.en.md **and** [skill-set.md](./skill-set.md) stay aligned |
| Case study / offer blurb | README.en.md (EN) · README.md (JA) |
| S1 card | [../en/sample-card-s1.md](../en/sample-card-s1.md) |
| Reviews how-to | [../en/reviews.md](../en/reviews.md) |
| Getting started | [../en/getting-started.md](../en/getting-started.md) |

**S1 hosted API:** Render Blueprint ([../en/deploy-render.md](../en/deploy-render.md)). Live URL: `https://ops-inbox-api.onrender.com` — health, `/docs`, and hosted `scripts/smoke.sh` verified. DoD Public URL: **Yes**.

---

## 8. Day-to-day command cheat sheet

```bash
# Local app
cp .env.example .env
docker compose up -d db
npm install
npx prisma migrate deploy
npm run db:seed          # optional; local hosts only
npm run start:dev

# Quality
npm run lint
npm test
npm run secret:audit
bash scripts/smoke.sh

# Hooks
bash scripts/install-git-hooks.sh
```

Agent shell on Windows host workspaces: use WSL (`wsl-agent-invoke`).

---

## 9. New repositories (inheritance)

Future projects get the same shape via:

- `bash ~/.cursor/scripts/bootstrap-project-foundation.sh`  
  → `docs/agents/skill-set.md`, `.cursorignore`, reviews stubs, …
- `~/.cursor/templates/project-rules/`  
  → `implementation-review.mdc`, `project-entry` row, …
- After bootstrap: fill skill-set + mirror README locales; customize review Stage 2–7 to stack.md

---

## 10. Explicitly out of scope / deferred

| Item | Status |
|------|--------|
| Hosted public API URL | Done — `https://ops-inbox-api.onrender.com` (hosted smoke verified) |
| Redacting outbound `summary` in `http` mode | Deferred (product tradeoff) |
| Dependabot | Deferred (noise policy) |
| `prisma.config.ts` | Defer until Prisma 7 migration |
| `.cursorindexingignore` | Not required for secrets (use `.cursorignore`) |

---

## 11. Maintenance

When changing conventions:

1. Update **this file** and the human mirrors (`docs/en|ja/conventions.md`).
2. Update the **source of truth** doc for that topic (`security.md`, `skill-set.md`, READMEs, rules) — do not fork conflicting text.
3. Keep `docs-language` (one locale per file).
