# Sample card S1 (in-repo copy)

**Source of truth (private backup):**  
https://github.com/hrn-dev-work/cursor-dotfiles/blob/main/docs/en/research-runs/2026-08-01.md  

This file is a **portable excerpt** so clones of `ops-inbox-api` do not depend on a local `~/workspace` path.

```yaml
id: S1
target_layer: U
job_pattern: "Fixed-price NestJS/Node API work: receive signed webhooks idempotently, call an external HTTP API, expose OpenAPI, and prove retries do not duplicate work."
stack:
  - NestJS  # ADR 0001
  - Prisma
  - PostgreSQL 16
  - OpenAPI/Swagger
  - Jest
plan: extend
existing_asset: this repository
dod:
  - smoke tests green
  - OpenAPI or /docs
  - README case study
  - public URL set (API + repo + offer blurb)
  - one outbound mock HTTP call on inbox item
non_goals:
  - GraphQL BFF
  - Real third-party production keys in git
stale_after_days: 90
```

Japanese: [../ja/sample-card-s1.md](../ja/sample-card-s1.md)
