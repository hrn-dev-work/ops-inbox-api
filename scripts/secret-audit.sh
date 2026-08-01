#!/usr/bin/env bash
# Audit tracked files, git history, and source for leaked secrets.
# Usage: bash scripts/secret-audit.sh [--strict]
# Pattern adapted from SmartResearch-HQ (docs/agents/security.md).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STRICT=0
if [[ "${1:-}" == "--strict" ]]; then
  STRICT=1
fi

issues=0
warn() { echo "WARN: $*" >&2; [[ "$STRICT" -eq 1 ]] && issues=$((issues + 1)) || true; }
fail() { echo "FAIL: $*" >&2; issues=$((issues + 1)); }

echo "== secret audit =="

echo "-- tracked secret-like paths --"
tracked_secret_files=$(
  git ls-files | grep -iE '(^|/)\.env(\.|$)|credentials\.json|service-account.*\.json|\.pem$|\.key$|id_rsa' \
    | grep -vE '\.example$|\.env\.example$' || true
)
if [[ -n "$tracked_secret_files" ]]; then
  fail "Secret-like files are tracked by git:"
  echo "$tracked_secret_files" >&2
else
  echo "OK: no .env / credentials / key files tracked (except *.example)"
fi

echo "-- git history (env / credentials paths) --"
history_paths=$(
  git log --all --pretty=format: --name-only -- \
    '.env' '.env.local' 'credentials.json' 'service-account.json' 2>/dev/null \
    | sort -u | grep -v '^$' || true
)
if [[ -n "$history_paths" ]]; then
  fail "These secret paths appear in git history (rotate keys + purge history):"
  echo "$history_paths" >&2
else
  echo "OK: no .env / credentials.json in commit history"
fi

echo "-- git history (key-like strings) --"
pickaxe_hits=0
for needle in 'AKIA' 'sk-' 'ghp_' 'gho_' 'xoxb-'; do
  if git log --all -S "$needle" --pretty=format: 2>/dev/null | grep -q .; then
    warn "History contains commits touching '$needle' — review: git log -p --all -S '$needle' | head"
    pickaxe_hits=$((pickaxe_hits + 1))
  fi
done
if [[ "$pickaxe_hits" -eq 0 ]]; then
  echo "OK: no AKIA / sk- / GitHub / Slack token prefixes in history pickaxe"
fi

echo "-- hardcoded secrets in source --"
secret_pattern='(api[_-]?key|secret[_-]?key|access[_-]?key|password|token|private[_-]?key)\s*=\s*["'\''`][^"'\'']{8,}'
hardcoded=$(
  grep -rniE "$secret_pattern" src test prisma scripts 2>/dev/null \
    | grep -viE 'test-key|example|dummy|placeholder|your[_-]?api|change-me|changeme|dev-webhook|process\.env|config\.get' \
    || true
)
if [[ -n "$hardcoded" ]]; then
  fail "Possible hardcoded secrets in source:"
  echo "$hardcoded" >&2
else
  echo "OK: no hardcoded secrets in src/test/prisma/scripts"
fi

echo "-- gitleaks (local optional; CI uses gitleaks-action) --"
if command -v gitleaks >/dev/null 2>&1; then
  if gitleaks detect --source "$ROOT" --no-banner --redact --verbose --config "$ROOT/.gitleaks.toml" 2>&1; then
    echo "OK: gitleaks found no leaks"
  else
    fail "gitleaks reported potential leaks (see above)"
  fi
else
  echo "SKIP: gitleaks not installed (optional locally; required in CI)"
fi

echo "== secret audit done =="
if [[ "$issues" -gt 0 ]]; then
  echo "Result: $issues issue(s) — rotate exposed credentials and purge git history if needed." >&2
  exit 1
fi
echo "Result: clean"
exit 0
