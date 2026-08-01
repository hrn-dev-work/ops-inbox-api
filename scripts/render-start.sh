#!/usr/bin/env bash
# Render start: migrate then Nest.
set -euo pipefail
echo "render-start: NODE_ENV=${NODE_ENV:-} PORT=${PORT:-}"
if [ -z "${DATABASE_URL:-}" ]; then
  echo "render-start: ERROR DATABASE_URL is empty" >&2
  exit 1
fi
echo "render-start: running prisma migrate deploy"
npx prisma migrate deploy
echo "render-start: starting node dist/main.js"
exec node dist/main.js
