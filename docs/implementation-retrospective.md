# 実装反省会ログ

コード実装後の振り返りを蓄積する。エージェントは `.cursor/rules/implementation-retrospective.mdc` に従い **新しいエントリを先頭に追記** する。

再発防止に効く改善は `.cursor/rules/*.mdc` へ反映する（本ログに「→ ルール更新: xxx」と書く）。

---

## テンプレート（コピー用）

```markdown
### YYYY-MM-DD — （変更概要 1 行）

- **変更**: （ファイル / 機能）
- **良かった点**:
- **改善点**:
- **ルール更新**: 無 / `implementation-core.mdc` §…
- **次回テスト**: Component / integration / system のどれを足すか
```

---

<!-- 以下、新しいエントリをこの行の上に追加 -->

### 2026-08-01 — S1 公開 API（Render）と DoD クローズ

- **変更**: `render.yaml` / `scripts/render-start.sh` / Prisma 単一 init マイグレーション / README・conventions の公開 URL DoD Yes / deploy 手順の締め
- **根拠**:
  - ホスト `GET /api/v1/health` → `database: up`、`/docs` → 200
  - `BASE_URL=https://ops-inbox-api.onrender.com` + Dashboard の `WEBHOOK_SIGNING_SECRET` で `scripts/smoke.sh` 成功（ingest `created:true` → replay `created:false` → `outboundCalls` mock）
  - 規約: DoD Public URL は **hosted live smoke 後のみ** Yes（秘密は git に含めない）
- **良かった点**: 失敗ごとに commit body で why を残した（`npm ci --include=dev`、`dist/main.js`、P3009 squash、`*.sql` の migration 例外）
- **改善点**:
  - 反省会ログと deploy 手順末尾の「DoD を更新せよ」が遅れ、状態と手順が一時的に不一致になった
  - `.cursorignore` の `*.sql` が `.gitignore` の migration 例外と揃っていなかった（エージェント索引漏れリスク）
  - `scripts/install-render-cli.sh` はローカル一時用のため **未コミットのまま**（意図が Blueprint 本番経路と無関係）
  - `docs/reviews/latest.md` は implementation-review 未実行のプレースホルダのまま（捏造しない）
- **ルール更新**: 有 — `docs/agents/conventions.md` §5.1.1 Hosted DoD closeout（atomic）+ Ignore sync; `.cursor/rules/implementation-retrospective.mdc` checklist; グローバル `git-commit-boundary.mdc`（scratch `??` 禁止）; テンプレ `.cursorignore` に migration SQL 例外; `portfolio-conventions-audit` A5b/B5b/B8。ローカル `scripts/install-render-cli.sh` は削除
- **次回テスト**: ホスト再デプロイ後は必ず env の秘密で smoke（ローカル既定秘密では 401）
