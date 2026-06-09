# Trinity MCP Starter — RAG over your database in 10 minutes

A small, production-shaped **MCP server** that gives Claude, Cursor or Windsurf
safe, audited access to a document store. This is the demo behind the
[Trinity service offering](../README.md): prospects run it in minutes, then I
wire the same shape onto *their* real Postgres, API or internal tools.

- **Zero-setup demo** — runs on bundled, seeded **SQLite**. No database to install.
- **Production path** — set `DATABASE_URL` and it talks to **PostgreSQL** instead.
- **Real-world hygiene** — typed tools, read-only mode, and a **JSONL audit log**
  of every call. The things off-the-shelf wrappers skip.

## Tools the model gets

| Tool | What it does |
|------|--------------|
| `list_docs` | List documents with id, title, kind |
| `search_docs` | Keyword-ranked search, returns snippets + ids |
| `get_doc` | Fetch one document in full by id |
| `add_doc` | Ingest a new document (disabled when `ALLOW_WRITES=0`) |

## Quick start (demo mode)

```bash
cd trinity-mcp/mcp-starter
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python server.py          # starts on stdio, seeds a demo SQLite db
```

You'll see `backend: SQLite (...seeded demo data)` on stderr. The server speaks
MCP over stdio — connect an MCP client to it (below).

## Connect to Claude Desktop / Cursor / Windsurf

Add this to your MCP client config (e.g. Claude Desktop's
`claude_desktop_config.json`, or Cursor's MCP settings). Use **absolute paths**.

```json
{
  "mcpServers": {
    "trinity-rag": {
      "command": "/absolute/path/to/.venv/bin/python",
      "args": ["/absolute/path/to/trinity-mcp/mcp-starter/server.py"]
    }
  }
}
```

Restart the client, then ask: *"Search my docs for the refund policy and
summarise it."* The model will call `search_docs` → `get_doc` and answer from
your data.

## Point it at real Postgres

```bash
docker compose up -d                                   # optional local Postgres
export DATABASE_URL=postgres://trinity:trinity@localhost:5432/trinity
python server.py                                       # now backend: PostgreSQL
```

The schema (`docs` table) is created automatically. Swap the keyword ranking in
`score()` for `pgvector` / full-text search in a real deployment.

## Configuration

| Env var | Default | Purpose |
|---------|---------|---------|
| `DATABASE_URL` | _(unset → SQLite)_ | Use Postgres when set |
| `ALLOW_WRITES` | `1` | `0` = read-only (disables `add_doc`) |
| `AUDIT_LOG` | `mcp_audit.jsonl` | Where call records are appended |
| `SQLITE_PATH` | `trinity_demo.db` | Demo database file |

## What a paid engagement adds

This starter is deliberately minimal. A real build layers on: your actual data
sources, semantic (vector) retrieval, row-level auth, rate limiting, an eval
harness so answers don't drift, and a hosted deploy. That's the
[Agent Integration](../README.md#pricing) tier — [book a free audit](../site/index.html).
