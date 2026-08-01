# Human documentation (English)

Put English human-facing guides in this tree (`docs/en/...`).

Agent-facing docs stay at repo root / `docs/agents/` / `docs/adr/` and are **English only**.  
Japanese human guides: `docs/ja/`.

Do **not** mix English and Japanese in one file. Layout policy: `docs-language` skill (`~/.cursor/skills/docs-language`).

- [Purpose (why this repo)](./purpose.md) — portfolio goal, demo script, non-goals
- [Getting started](./getting-started.md) — first hour in this app repo
- [Conventions](./conventions.md) — handbook: docs language, safety, quality gates, skills
- [Deploy on Render](./deploy-render.md) — S1 public API (Blueprint)
- [Local database (Docker)](./local-database.md) — Postgres runs in Compose, not on the host
- [Local seed (Faker)](./local-seed.md) — safe dummy data; no production rows
- [Reviews](./reviews.md) — 7-stage implementation-review protocol and report location
