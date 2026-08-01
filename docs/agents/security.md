# Security guardrails (all projects)

Agents and contributors: **read before** adding API surface, env vars, user input handling, or auth.

Detailed project traps: **`CONTEXT.md` § Security Guardrails** (if present).

## Secrets & configuration

- Never commit `.env`, API keys, tokens, `credentials.json`, or private keys.
- `.env.example`: **key names only** — empty or dummy values.
- Server-only secrets stay on the backend. **`NEXT_PUBLIC_*` / browser-exposed env is public** — never put PA-API, Gemini, DB, or Sheets credentials there.
- Do not log secrets, PII, or full request payloads with credentials.
- **Logging:** log correlation fields only (`provider`, `externalId`, `inboxItemId`). Never log raw webhook bodies, `payload`, or seeded customer email/phone.
- Keep production dumps / CSV exports out of the repo. Use root `.cursorignore` so Cursor does not index `.env*`, keys, logs, or dump files. Agent Shell/MCP are **not** blocked by `.cursorignore` — keep real secrets out of the tree.
- Local demo data: `npm run db:seed` (`prisma/seed.ts` + Faker only). Seed **refuses** non-local `DATABASE_URL` hosts and `NODE_ENV=production`.
- `OUTBOUND_MODE=http` posts inbox title/summary to `OUTBOUND_URL` with `OUTBOUND_TIMEOUT_MS`; keep `mock` for demos.

## Grilling — security (Round 1 extension)

When scope touches API, forms, URLs, file I/O, or deployment, also confirm:

1. **Exposure** — Who can call this unauthenticated? New public endpoints?
2. **Input** — Untrusted strings (URLs, IDs, HTML)? Injection/SSRF/XSS paths?
3. **Env** — New variable server-side or client-side?

## Public standards (mandatory baseline)

Code generation and design **must** align with:

| Standard | Apply |
|----------|--------|
| **[OWASP Top 10](https://owasp.org/www-project-top-ten/)** (latest) | Eliminate injection, broken access control, misconfiguration, SSRF, vulnerable components, etc. |
| **[IPA — 安全なウェブサイトの作り方](https://www.ipa.go.jp/security/vuln/websecurity.html)** | XSS, SQLi, CSRF, session issues — implement controls at code level, not “document only”. |
| **Static analysis** | Do not merge code that fails configured linters/scanners (ESLint, Ruff, CodeQL, gitleaks, Trivy secret, Dependabot alerts you touch). |
| **TypeScript** | No careless `any` or unsafe casts that bypass validation; use `strict` patterns. |

If a scanner flags a finding, **fix or document accepted risk in an ADR** — do not silence without review.

## Repo tooling (this sample)

| Layer | Path |
|-------|------|
| Pre-commit | `bash scripts/install-git-hooks.sh` → `.githooks` → `scripts/pre-commit-secret-check.sh` |
| Local / CI baseline | `bash scripts/secret-audit.sh` |
| CI | `.github/workflows/ci.yml` — `secret-audit` then `lint-and-test` |
| Config | `.gitleaks.toml`, `.trivyignore` |

GitHub **Secret Scanning + Push Protection** remain org/repo settings (manual).

## References
- Project ADRs under `docs/adr/` — especially auth and public-API decisions.
- [domain.md](./domain.md) — CONTEXT / ADR update rules.
