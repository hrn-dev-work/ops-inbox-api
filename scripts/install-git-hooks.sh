#!/usr/bin/env bash
# Point this repo at .githooks (secret pre-commit).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
chmod +x scripts/pre-commit-secret-check.sh scripts/secret-audit.sh .githooks/pre-commit 2>/dev/null || true
git config core.hooksPath .githooks
echo "Installed: core.hooksPath=.githooks"
echo "Verify: bash scripts/secret-audit.sh"
