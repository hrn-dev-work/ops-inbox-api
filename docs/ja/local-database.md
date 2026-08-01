# ローカル DB（Docker）

ローカルのアプリデータ用 DB は、Windows / WSL に Postgres を直接入れるのではなく、**Docker Compose 上の PostgreSQL 16** です。

| 項目 | 値 |
|------|-----|
| エンジン | PostgreSQL 16 |
| 動かし方 | Compose サービス `db`（イメージ `postgres:16`） |
| ポート | 通常 `localhost:5432`（WSL/ホストへ公開） |
| 接続 | `DATABASE_URL`（`.env.example` 参照） |
| 本番 | マネージド Postgres（Render / Railway 等）— メジャーバージョンを揃える |

## コマンド例

```bash
docker compose up -d db
docker compose ps
docker compose logs -f db
```

## IDE

| 目的 | 拡張機能 |
|------|----------|
| コンテナの確認・起動 | Containers（`ms-azuretools.vscode-containers`） |
| テーブル閲覧・SQL | SQLTools + PostgreSQL ドライバ（`mtxr.sqltools`, `mtxr.sqltools-driver-pg`） |

English: [../en/local-database.md](../en/local-database.md)  
エージェント正本: [../agents/stack.md](../agents/stack.md)
