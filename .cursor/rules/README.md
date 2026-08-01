# ops-inbox-api — Cursor Rules

| ファイル | 適用トリガー | 内容 |
|----------|--------------|------|
| `project-entry.mdc` | 毎セッション（唯一の alwaysApply） | ルーティング表 |
| `implementation-core.mdc` | コード編集時（glob） | DDD・命名・疎結合 |
| `testing-istqb.mdc` | テスト編集時（glob） | ISTQB 準拠 |
| `security-git.mdc` | scripts / env 編集時（glob） | 秘密情報・Git |
| `implementation-retrospective.mdc` | 実装後 / stop フック（glob） | 反省会 |

<!-- プロジェクト固有 rules を下に追記 -->

## グローバル User Rules との関係

- **正本:** `~/.cursor/rules/`（WSL）。`~/.cursor/rules/global-agent-routing.mdc` が全体のルーター。
- **優先順位:** 本リポジトリの `.cursor/rules/*.mdc` + `docs/` + `AGENTS.md` が、グローバルより優先。

テンプレ由来: `~/.cursor/templates/project-rules/`
