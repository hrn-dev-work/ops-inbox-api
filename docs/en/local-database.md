# Local database (Docker)

Local app data uses **PostgreSQL 16 inside Docker Compose**, not a PostgreSQL install on Windows or WSL.

| Item | Value |
|------|-------|
| Engine | PostgreSQL 16 |
| How it runs | Compose service `db` (image `postgres:16`) |
| Typical port | `localhost:5432` (published to WSL/host) |
| Connection | `DATABASE_URL` (see `.env.example`) |
| Prod | Managed Postgres (Render/Railway, etc.) — same major version |

## Commands

```bash
docker compose up -d db
docker compose ps
docker compose logs -f db
```

## IDE

| Goal | Extension |
|------|-----------|
| See / start containers | Containers (`ms-azuretools.vscode-containers`) |
| Browse tables / run SQL | SQLTools + PostgreSQL driver (`mtxr.sqltools`, `mtxr.sqltools-driver-pg`) |

Japanese: [../ja/local-database.md](../ja/local-database.md)  
Agent SSOT: [../agents/stack.md](../agents/stack.md)
