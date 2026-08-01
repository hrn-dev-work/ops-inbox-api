# Ops Inbox API

Portfolio sample for backend freelance work: **signed webhook ingest → idempotent storage → ops inbox**.

| | |
|---|---|
| Stack | NestJS 11 · Prisma 6 · PostgreSQL 16 · OpenAPI |
| Problem | Providers retry webhooks; naive handlers create duplicate tickets |
| Result | `(provider, externalId)` uniqueness + HMAC verification |

Live docs: `http://localhost:3000/docs`

## Case study

**Challenge** — SaaS tools retry the same webhook. Clients need verified, idempotent ingest and a normalized inbox.

**Approach**

1. Verify `X-Signature-SHA256` (HMAC-SHA256 of raw body)
2. Upsert by `(provider, externalId)` — retries return existing item (`created: false`)
3. Map payload → `InboxItem`
4. REST list / status update + Swagger

## Quick start

```bash
cp .env.example .env
docker compose up -d db
npm install
npx prisma migrate dev --name init
npm run start:dev
```

Health: `GET http://localhost:3000/api/v1/health`  
Smoke: `bash scripts/smoke.sh`

## License

MIT
