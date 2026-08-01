#!/usr/bin/env bash
set -euo pipefail
cd /home/haruna/workspace/ops-inbox-api

BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "=== HEALTH ==="
curl -sS "$BASE_URL/api/v1/health"
echo

SECRET=dev-webhook-secret-change-me
BODY='{"externalId":"evt_demo_001","payload":{"title":"Payment retry failed","message":"Timeout talking to PSP","severity":"HIGH"}}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

echo "=== INGEST ==="
curl -sS -X POST "$BASE_URL/api/v1/webhooks/stripe" \
  -H "Content-Type: application/json" \
  -H "X-Signature-SHA256: $SIG" \
  -d "$BODY"
echo

echo "=== REPLAY ==="
curl -sS -X POST "$BASE_URL/api/v1/webhooks/stripe" \
  -H "Content-Type: application/json" \
  -H "X-Signature-SHA256: $SIG" \
  -d "$BODY"
echo

echo "=== INBOX ==="
curl -sS "$BASE_URL/api/v1/inbox"
echo
