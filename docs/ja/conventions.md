# プロジェクト規約

人向け日本語ハンドブック。エージェント向け正本（詳細）: [../agents/conventions.md](../agents/conventions.md)。  
英語: [../en/conventions.md](../en/conventions.md)。

**ops-inbox-api** の進め方と、最近入れた安全・品質まわりの改善をまとめています。

---

## ドキュメント言語

- `README.md` + `docs/en/` → 英語のみ  
- `README.ja.md` + `docs/ja/` → 日本語のみ  
- エージェント向け（`CONTEXT.md`、`docs/agents/`、ADR、Cursor rules）→ 英語のみ  
- 同一ファイルに英日を混ぜない

---

## スタック

NestJS 11 · Prisma 6 · PostgreSQL 16（Docker Compose）· REST + OpenAPI。  
[ADR 0001](../adr/0001-nestjs-prisma-backend.md) · [agents/stack.md](../agents/stack.md)

---

## プロダクト上の必須ルール

- Webhook は HMAC 検証、`(provider, externalId)` で冪等
- Controller は薄く、業務は Service
- outbound 既定は **mock**（本番用外部キーをリポに置かない）

---

## 安全（PII / 秘密 / AI コンテキスト）

| 施策 | やり方 |
|------|--------|
| Cursor から除外 | ルート `.cursorignore` |
| Git から除外 | `.gitignore`（ダンプ・鍵・ログ） |
| ローカルデモデータ | `npm run db:seed`（Faker のみ。リモート DB / production は拒否） |
| ログ | id のみ。payload や顧客 PII を出さない |
| シークレット検査 | `npm run secret:audit`、任意で `bash scripts/install-git-hooks.sh` |
| Outbound HTTP | `OUTBOUND_TIMEOUT_MS` でタイムアウト。ローカルは mock 推奨 |

詳細: [local-seed.md](./local-seed.md) · [agents/security.md](../agents/security.md)

---

## 品質ゲート

| ゲート | コマンド / 成果物 |
|--------|-------------------|
| Lint + 単体 | `npm run lint` · `npm test` |
| Secret audit | `npm run secret:audit` |
| Smoke（API 起動時） | `bash scripts/smoke.sh` |
| コミット前レビュー（任意・徹底） | エージェントに **implementation-review** → [../reviews/latest.md](../reviews/latest.md) |
| CI | `.github/workflows/ci.yml` — secret-audit のあと lint + test |

レビュー手順: [reviews.md](./reviews.md)

---

## スキル・エージェント経路

- 人向けスキル表: [README.ja.md](../../README.ja.md) のスキルセット節  
- エージェント一覧: [agents/skill-set.md](../agents/skill-set.md)  
- Cursor ルーター: `.cursor/rules/project-entry.mdc`

---

## 未完了（S1）

ホストした **公開 API URL** — [deploy-render.md](./deploy-render.md) でデプロイし、live smoke 後に DoD を Yes にする。

---

## 関連

- [はじめに](./getting-started.md)
- [Render デプロイ](./deploy-render.md)
- [ローカル DB](./local-database.md)
- [ローカル seed](./local-seed.md)
- [レビュー](./reviews.md)
- [調査カード S1](./sample-card-s1.md)
