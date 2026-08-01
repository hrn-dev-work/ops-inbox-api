# ops-inbox-api — Cursor Rules

| File | Trigger | Purpose |
|------|---------|---------|
| `project-entry.mdc` | Every session (only alwaysApply) | Routing table |
| `implementation-core.mdc` | Code edits (glob) | DDD, naming, loose coupling |
| `implementation-review.mdc` | Explicit **implementation-review** / pre-commit | 7-stage sequential review → `docs/reviews/latest.md` |
| `testing-istqb.mdc` | Test edits (glob) | ISTQB-aligned testing |
| `security-git.mdc` | scripts / env edits (glob) | Secrets and Git safety |
| `implementation-retrospective.mdc` | After impl / stop hook (glob) | Retrospective append |

Consolidated handbook: `docs/agents/conventions.md` (humans: `docs/en/conventions.md` · `docs/ja/conventions.md`).

<!-- Add project-specific rules below -->

## Relationship to global User Rules

- **Canonical globals:** `~/.cursor/rules/` (WSL). Router: `global-agent-routing.mdc`.
- **Precedence:** this repo’s `.cursor/rules/*.mdc` + `docs/` + `AGENTS.md` override globals when they conflict.

Template source: `~/.cursor/templates/project-rules/`
