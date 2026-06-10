---
tags: [module, infra, railway]
status: running
repo: https://github.com/gHashTag/trios-railway
---

# trios-railway

Сервисы проекта IGLA + Postgres на **Railway**. Инфраструктурный слой.

- Хостит БД для [[trios-mcp-rag]] (слой [[Память]])
- Рекомендация: MCP-сервер (HTTP-транспорт) + Postgres держать тут; статичный
  [[Trinity Site|лендинг]] — на Cloudflare Pages (дешевле/быстрее)

← [[Agentic OS]]
