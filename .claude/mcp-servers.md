# MCP servers

Everything here was verified by launching the servers in a remote session on 2026-08-20:
each was started over stdio, `tools/list` was called, and where possible a real tool call
was made. Versions are what npm served that day.

## Enabled in `.mcp.json`

| Server | Package | Status |
|---|---|---|
| `context7` | hosted `https://mcp.context7.com/mcp` | Verified working; needs a free API key |
| `sequential-thinking` | `@modelcontextprotocol/server-sequential-thinking` v2026.7.4 | Works, no key |
| `playwright` | `@playwright/mcp` v0.0.79 | Starts, but **inert in remote sessions** — see below |

### context7 — up-to-date library docs

Exposes `resolve-library-id` and `query-docs`. This is the one that closes a real gap: the
model's training data has a cutoff, and Context7 fetches current documentation for a library
at query time. Verified end to end — a `query-docs` call for PyTorch returned 5.8 KB of
current documentation in 2.6 s.

**Configured against the hosted server, not the npm package.** Context7 ships both an
`@upstash/context7-mcp` stdio wrapper and a hosted endpoint at `https://mcp.context7.com/mcp`.
The stdio wrapper answered `initialize` and `tools/list` but hung indefinitely on every real
tool call here, with and without an API key; the hosted endpoint answers the identical calls in
under three seconds. The hosted one also avoids spawning `npx` on every session start, so it is
what `.mcp.json` points at.

**A key is required in practice.** Anonymous requests are pooled per egress IP, and a shared
container IP means the anonymous quota is frequently already spent — the API then answers
`HTTP 200` with `{"error":"Quota Exceeded"}`, which clients tend to hang on rather than report.
The quota is intermittent, not permanently exhausted: the same anonymous call failed one day and
succeeded the next, so a key is the difference between reliable and coin-flip.

Get a free key at https://context7.com/dashboard and put it in the environment:

```bash
export CONTEXT7_API_KEY="ctx7sk-..."
```

`.mcp.json` interpolates it into the Authorization header, so the key itself is never committed.
In remote web sessions, set it as an environment variable on the environment (the container is
rebuilt each session, so a shell export does not survive).

### sequential-thinking — structured reasoning scratchpad

Exposes one tool, `sequentialthinking`, for breaking a problem into revisable numbered steps.
Verified working with no key and no configuration.

Note it overlaps heavily with the model's own extended thinking, which covers the same ground
without a tool round-trip. Kept because it is free and harmless, but do not expect it to add
much on top of native reasoning.

### playwright — real browser

Exposes 24 tools (`browser_navigate`, `browser_click`, `browser_evaluate`, snapshots, …).
The server starts correctly here and the bundled Chromium 141 runs.

**It cannot reach the network in a remote session.** Every navigation fails with
`ERR_CONNECTION_RESET`, with or without `--proxy-server` pointed at the session proxy, and the
proxy records no CONNECT attempt for the target host — only Chromium's own telemetry calls.
Browser egress is blocked by the environment's policy, so this is not a misconfiguration to fix
from inside the session.

It is left enabled because the same config is used on a local machine, where it works normally.
In remote sessions, use `WebFetch` instead.

## Not enabled — paid keys required

Both need an account with billing, so they are documented rather than configured. Add them to
`.mcp.json` if the keys are ever obtained.

### perplexity

```json
"perplexity": {
  "command": "npx",
  "args": ["-y", "server-perplexity-ask"],
  "env": { "PERPLEXITY_API_KEY": "${PERPLEXITY_API_KEY}" }
}
```

Web search with citations (`server-perplexity-ask` v0.1.3). Largely duplicates the built-in
`WebSearch` tool, which needs no key — the practical difference is Perplexity's own ranking
and synthesis, not access to anything otherwise unreachable.

### firecrawl

```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
}
```

Scrapes pages into clean markdown, crawls whole sites, handles JavaScript rendering
(`firecrawl-mcp` v3.24.0). Free tier is a small one-off credit allowance, not a recurring quota.
For single pages the built-in `WebFetch` already suffices; Firecrawl earns its place only for
bulk crawling or JS-heavy sites.

## Re-verifying

To check a server without a client, drive it over stdio directly:

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  | npx -y <package>
```

A server that answers `initialize` but stalls on a tool call is usually failing upstream —
check the provider's API directly with `curl` before assuming the server is broken.
