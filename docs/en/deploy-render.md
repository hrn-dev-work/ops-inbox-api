# Deploy on Render (S1 public API)

English. Japanese: [../ja/deploy-render.md](../ja/deploy-render.md).  
Agent conventions: [../agents/conventions.md](../agents/conventions.md).

This sample uses a **Render Blueprint** ([render.yaml](../../render.yaml)): free Web Service + free Postgres.

## Limits (free tier)

| Limit | Effect |
|-------|--------|
| Web idle spin-down (~15 min) | First request after idle may take ~1 minute (cold start) |
| Free Postgres **30-day** expiry | Demo only; upgrade or recreate for longer demos |
| One free Postgres per workspace | Delete unused free DBs if Blueprint create fails |

## Prerequisites

- GitHub repo: `https://github.com/hrn-dev-work/ops-inbox-api` (public)
- Render account linked to that GitHub org/user
- `main` includes `render.yaml`

## Deploy Blueprint

1. Open [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Select this repository and branch `main`
3. Confirm Blueprint path `render.yaml`
4. **Deploy Blueprint**

Render creates:

- Postgres `ops-inbox-db`
- Web service `ops-inbox-api` (HTTPS `*.onrender.com`)

On each **build**: `npm ci --include=dev && npx prisma generate && npm run build`  
(`--include=dev` is required so Nest CLI / Prisma CLI install under `NODE_ENV=production`.)

On each **start**: `npm run start:render` (`prisma migrate deploy` then `node dist/src/main.js`).

## Environment

| Key | Source |
|-----|--------|
| `DATABASE_URL` | From Render Postgres `connectionString` |
| `WEBHOOK_SIGNING_SECRET` | Auto-generated (`generateValue`) — copy from Dashboard → Environment |
| `OUTBOUND_MODE` | `mock` |
| `NODE_ENV` | `production` |
| `PORT` | Set by Render |

Do **not** commit real secrets. Do **not** run `npm run db:seed` against Render (seed refuses non-local hosts / production).

## Verify

After the first deploy turns **Live** (wait through cold start if needed):

```bash
# From Dashboard → ops-inbox-api → Environment, copy WEBHOOK_SIGNING_SECRET
export BASE_URL="https://<service-name>.onrender.com"
export WEBHOOK_SIGNING_SECRET="<from-dashboard>"
bash scripts/smoke.sh
```

- Health: `GET $BASE_URL/api/v1/health`
- Swagger: `$BASE_URL/docs`

## After URL is known

Update root `README.md` / `README.ja.md` **Status vs S1 DoD** (Public URL = Yes) and [../agents/conventions.md](../agents/conventions.md) § hosted URL.
