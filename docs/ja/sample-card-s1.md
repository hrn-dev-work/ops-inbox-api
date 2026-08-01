# サンプル案カード S1（リポ内コピー）

**原本（private バックアップ）:**  
https://github.com/hrn-dev-work/cursor-dotfiles/blob/main/docs/ja/research-runs/2026-08-01.md  

ローカルの `~/workspace` に依存しないよう、このリポに抜粋を置いています。

```yaml
id: S1
target_layer: U
plan: extend
existing_asset: 本リポジトリ
dod:
  - smoke 緑
  - OpenAPI /docs
  - README ケース
  - 公開 URL 一式
  - outbound モック HTTP 1本
non_goals:
  - GraphQL BFF
  - 本番外部 API キーを git に含めること
stale_after_days: 90
```

English: [../en/sample-card-s1.md](../en/sample-card-s1.md)
