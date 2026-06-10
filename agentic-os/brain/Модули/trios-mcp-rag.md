---
tags: [module, mcp, rust]
status: running
repo: https://github.com/gHashTag/trios-mcp-rag
---

# trios-mcp-rag

Production MCP-сервер: **RAG over PostgreSQL** с 5 агент-инструментами (search,
fetch, list, build_pdf, audit). Ядро монетизации MCP-услуг.

- Стек: Rust + tokio-postgres, транспорт stdio/JSON-RPC
- Демо-версия для продаж: `trinity-mcp/mcp-starter/`
- Хостинг: [[trios-railway|Railway]] (Postgres)

Связи: реализует [[MCP]] · слой [[Память]] · питает [[Что нового в AI]]
← [[Agentic OS]]
