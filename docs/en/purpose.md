# Why this repository exists

## One sentence

This is a **public portfolio demo**, not a product for end users.  
It proves you can ship a **NestJS webhook ingest API** that clients can click and verify.

## Business purpose

Support **fixed-price / spot** freelance proposals on:

- [Upwork](https://www.upwork.com/)
- [CrowdWorks](https://crowdworks.jp/) (and similar JP marketplaces)

when the job looks like:

> “Receive signed webhooks from a provider, store them without duplicates when the provider retries, expose a small REST + OpenAPI surface, optionally notify another system once.”

The deliverable for a proposal is **evidence**, not a long CV:

| Evidence | Where |
|----------|--------|
| Source + case study | This GitHub repo + root `README.md` |
| Live API | [https://ops-inbox-api.onrender.com](https://ops-inbox-api.onrender.com) · [OpenAPI `/docs`](https://ops-inbox-api.onrender.com/docs) |
| Automated check | `scripts/smoke.sh` (local Docker + hosted) |
| Research card | [sample-card-s1.md](./sample-card-s1.md) (id **S1**) |

Private strategy / research backup (not required to run the app):  
`cursor-dotfiles` → `docs/en/portfolio-automation-strategy.md` and research run `2026-08-01`.

## What a reviewer should understand in 60 seconds

1. **Inbound:** `POST /api/v1/webhooks/:provider` with `X-Signature-SHA256` (HMAC of the raw body).
2. **Idempotency:** same `(provider, externalId)` twice → one inbox row; second response has `created: false`.
3. **Ops shape:** normalized `InboxItem` (title / summary / severity / status), not raw provider JSON as the main API.
4. **Outbound:** on **first** create only, one recorded notify (`OUTBOUND_MODE=mock` by default — no real vendor keys in git).
5. **Contract:** Swagger at `/docs`.

## Concrete demo script (for proposals)

1. Open [hosted `/docs`](https://ops-inbox-api.onrender.com/docs).
2. Send the same signed webhook payload twice (same `externalId`).
3. `GET /api/v1/inbox` → **one** item; `outboundCalls` length **1** (not 2).
4. Point at the README case study and the public repo URL.

Local equivalent: [getting-started.md](./getting-started.md) + `bash scripts/smoke.sh`.

## Who this is for / not for

| Audience | Role |
|----------|------|
| Proposal reviewers / hiring clients | Primary — they judge skill from the live demo |
| You (operator) + coding agents | Remember *why* the repo exists and what DoD means |
| End users of a real ops product | **Not** — there is no product UI or multi-tenant SaaS |

## Explicit non-goals

- GraphQL BFF, React/Next marketing UI
- Real third-party **production** API keys committed to git
- Full CRM / ticketing product features beyond the sample surface

## Definition of done (S1)

Tracked in the README “Status vs S1 DoD” table and [sample-card-s1.md](./sample-card-s1.md): smoke green, OpenAPI `/docs`, README case study, outbound mock, public URL (hosted API + GitHub).

Japanese: [../ja/purpose.md](../ja/purpose.md)
