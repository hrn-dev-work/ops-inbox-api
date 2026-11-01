# Skill set (agents)

**English only.** Human-facing skill tables: [README.md](../../README.md) (English) and [README.ja.md](../../README.ja.md) (Japanese), with language links at the top of both files.
Stack SSOT: [stack.md](./stack.md). Consolidated conventions: [conventions.md](./conventions.md).  
Routing: `.cursor/rules/project-entry.mdc` + `~/.cursor/rules/global-agent-routing.mdc`.

This file lists **what agents should apply** in this repo and **what the sample demonstrates**. Do not invent alternate stacks without an ADR.

---

## A. Sample skills (this product demonstrates)

Aligned with Research card **S1** and the public README skill table.

| Area | Skills |
|------|--------|
| Backend | NestJS 11 · TypeScript (strict) · modular Nest architecture |
| API | REST `/api/v1` · OpenAPI / Swagger · DTO validation (`class-validator`) |
| Data | PostgreSQL 16 · Prisma 6 · migrations · unique-constraint idempotency |
| Integrations | HMAC-SHA256 webhook verify · idempotent ingest `(provider, externalId)` · outbound HTTP notify (mock by default) |
| Domain | Webhook → Inbox normalization · severity / status lifecycle |
| Quality | Jest · `scripts/smoke.sh` · health + DB ping · `scripts/secret-audit.sh` |
| Local ops | Docker Compose Postgres · `.env` / `.env.example` (keys only) · `.cursorignore` · Faker `prisma/seed.ts` (local-host guard) |

**Research tags (S1):** `nestjs` · `prisma` · `rest-api` · `openapi` · `webhook` · `outbound-integration` · `testing`

**Out of scope for this sample:** GraphQL BFF · React/Next UI · Redis · real third-party production credentials

---

## B. Cursor skills (procedures — read when the situation matches)

| Skill | When |
|-------|------|
| `docs-language` | README.md (English) + README.ja.md (Japanese), with top language links; `docs/en|ja` one locale; this directory stays English |
| `wsl-agent-invoke` | Shell, git, gh on `\\wsl.localhost\` / WSL Ubuntu workspace |
| `bootstrap-project-foundation` | Missing `CONTEXT.md` or `project-entry.mdc` (hook may already have run) |
| `agent-session-closeout` | Substantial work finished (impl / docs / Git·PR) |
| `skill-learning-retrospective` | User asks for retrospective / skill updates; pair with repo retrospective rule |
| `freelance-job-research` | Market research → sample cards only (no app code in that skill) |
| `portfolio-conventions-audit` | 規約確認 / DoD vs reality / before claiming sample ship done |
| `conventional-pr-title` | Creating or editing GitHub PR titles |
| `distinctive-ui` | **N/A for this API-only sample** unless a UI is added later |

Paths: `~/.cursor/skills/<name>/SKILL.md` (WSL: `~/…` or `/mnt/c/Users/msmhr/.cursor/skills/…`).

---

## C. Rules (invariants)

### Repo (`.cursor/rules/`)

| Rule | When |
|------|------|
| `project-entry.mdc` | Always — situation → follow table |
| `implementation-core.mdc` | Code edits |
| `implementation-review.mdc` | Explicit **implementation-review** / pre-commit review (7 stages; write `docs/reviews/latest.md`) |
| `testing-istqb.mdc` | Tests |
| `security-git.mdc` | Secrets · Git safety |
| `implementation-retrospective.mdc` | After implementation — append `docs/implementation-retrospective.md` |

### Global (`~/.cursor/rules/` — always relevant here)

| Rule | When |
|------|------|
| `project-foundation.mdc` | Before non-trivial work · CONTEXT · grilling · security |
| `default-stack.mdc` | Defaults; **overridden** by this repo’s [stack.md](./stack.md) + ADR 0001 |
| `global-balanced-defaults.mdc` | Minimal change · quality · safety |
| `agent-wsl-git.mdc` | WSL / UNC shell and git |
| `git-commit-boundary.mdc` | Before commit / push / PR |
| `portfolio-conventions-audit.mdc` | Portfolio sample compliance triggers |

UI rules (`ui-i18n-locale`, `distinctive-ui`, `react-component-conventions`) stay listed in `project-entry` for template parity; they do not apply until this repo has a web UI.

---

## D. Hooks (automation, not skills)

| Location | Event | Role |
|----------|-------|------|
| `~/.cursor/hooks.json` → `ensure-project-bootstrapped.sh` | `sessionStart` | Auto-run foundation bootstrap if `CONTEXT.md` / `project-entry` missing |
| `.cursor/hooks/track-code-edit.sh` | `afterFileEdit` | Track edits for retrospective |
| `.cursor/hooks/stop-retrospective.sh` | `stop` | Prompt post-work retrospective loop |

Do not disable the user-level `sessionStart` hook unless the user asks; side effect may open the hook script tab in the editor (Cursor UI).

---

## E. Maintenance

- When conventions change: update [conventions.md](./conventions.md) and human mirrors `docs/en|ja/conventions.md` in the same change.
- Sample skill rows change when shipped features or S1 DoD change — update **this file** and both `README.md` and `README.ja.md` together (`docs-language`).
- Agent skill/rule rows change when `project-entry` or global routing changes — keep this file aligned with those tables (do not fork conflicting guidance).
- Pre-commit quality gate: run **implementation-review** (`.cursor/rules/implementation-review.mdc`) → `docs/reviews/latest.md`.
- CI gate: `.github/workflows/ci.yml` (`secret-audit` → lint + test).
