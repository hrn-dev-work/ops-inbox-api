# Local seed data (safe dummies)

English. Japanese: [../ja/local-seed.md](../ja/local-seed.md).

This project never needs production rows locally. Seed data is generated with `@faker-js/faker` in `prisma/seed.ts` (no hardcoded emails/phones).

## Prerequisites

- Docker Compose Postgres up (`npm run db:up`)
- `.env` with **local** `DATABASE_URL` (from `.env.example` — host must be `localhost` / `127.0.0.1` / `db` / `host.docker.internal`)
- Migrations applied (`npx prisma migrate deploy`)
- `NODE_ENV` must not be `production` (seed refuses)

## Seed

```bash
npm install
npm run db:seed
```

Equivalent: `npx prisma db seed`.

The script:

1. Calls `assertSafeSeedDatabaseUrl` (blocks remote / production targets)
2. **Clears** `outbound_calls`, `inbox_items`, and `webhook_events`
3. Inserts 8 demo chains (webhook → inbox → outbound) with Faker values

## Smoke vs seed

`bash scripts/smoke.sh` creates its own webhook with a unique `externalId`. Seeded rows do not break smoke; inbox list may contain both.

## AI context safety

Root `.cursorignore` excludes `.env*`, keys, logs, dumps (`*.sql` / `*.csv`), and similar paths. Shell tools can still read ignored files — do not place real dumps in the workspace.

## Outbound note

Keep `OUTBOUND_MODE=mock` locally. `http` mode POSTs title/summary to `OUTBOUND_URL` with `OUTBOUND_TIMEOUT_MS` (default 5000).

## Verify

Confirm `prisma/seed.ts` uses `faker.internet.email()` / `faker.person.fullName()`. With the API running:

```bash
curl -s http://localhost:3000/api/v1/inbox | head
```
