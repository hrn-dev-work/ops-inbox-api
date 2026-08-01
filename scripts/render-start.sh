#!/usr/bin/env bash
# Render start: migrate then Nest.
set -euo pipefail

echo "render-start: NODE_ENV=${NODE_ENV:-} PORT=${PORT:-}"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "render-start: ERROR DATABASE_URL is empty" >&2
  exit 1
fi

# Log host only (never password).
DB_HOST="$(node -e "try{console.log(new URL(process.env.DATABASE_URL).hostname)}catch{console.log('INVALID_DATABASE_URL')}")"
echo "render-start: DATABASE_URL host=${DB_HOST}"

if [ ! -x node_modules/.bin/prisma ] && [ ! -f node_modules/prisma/package.json ]; then
  echo "render-start: ERROR prisma package missing from node_modules" >&2
  ls node_modules/.bin 2>&1 | head -50 >&2 || true
  exit 1
fi

echo "render-start: migrations on disk:"
ls -la prisma/migrations || true
find prisma/migrations -type f -print || true

echo "render-start: running prisma migrate deploy"
set +e
./node_modules/.bin/prisma migrate deploy
MIGRATE_EXIT=$?
set -e

if [ "$MIGRATE_EXIT" -ne 0 ]; then
  echo "render-start: migrate failed exit=${MIGRATE_EXIT}" >&2
  echo "render-start: migrate status:" >&2
  ./node_modules/.bin/prisma migrate status >&2 || true
  echo "render-start: If P3009: delete Render Postgres ops-inbox-db, Manual Sync Blueprint, redeploy." >&2
  exit "$MIGRATE_EXIT"
fi

echo "render-start: starting node dist/main.js"
exec node dist/main.js
