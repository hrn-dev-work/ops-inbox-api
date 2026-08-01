#!/usr/bin/env bash
set -euo pipefail
cd /home/haruna/workspace/ops-inbox-api

BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "=== HEALTH ==="
curl -sS "$BASE_URL/api/v1/health"
echo

SECRET=dev-webhook-secret-change-me
EXT_ID="evt_demo_$(date +%s)"
BODY=$(printf '{"externalId":"%s","payload":{"title":"Payment retry failed","message":"Timeout talking to PSP","severity":"HIGH"}}' "$EXT_ID")
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

echo "=== INGEST ($EXT_ID) ==="
INGEST=$(curl -sS -X POST "$BASE_URL/api/v1/webhooks/stripe" \
  -H "Content-Type: application/json" \
  -H "X-Signature-SHA256: $SIG" \
  -d "$BODY")
echo "$INGEST"
echo "$INGEST" | grep -q '"created":true' || { echo "expected created:true"; exit 1; }

echo "=== REPLAY ==="
REPLAY=$(curl -sS -X POST "$BASE_URL/api/v1/webhooks/stripe" \
  -H "Content-Type: application/json" \
  -H "X-Signature-SHA256: $SIG" \
  -d "$BODY")
echo "$REPLAY"
echo "$REPLAY" | grep -q '"created":false' || { echo "expected created:false on replay"; exit 1; }

echo "=== INBOX (expect outboundCalls) ==="
INBOX=$(curl -sS "$BASE_URL/api/v1/inbox")
echo "$INBOX"
echo "$INBOX" | grep -q 'outboundCalls' || { echo "missing outboundCalls"; exit 1; }
echo "$INBOX" | grep -q 'mock://ops-inbox/notify' || { echo "missing mock outbound target"; exit 1; }
echo "OK"