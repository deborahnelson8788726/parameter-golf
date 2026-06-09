# Trinity — AI Agents & MCP Integration (commercial front)

A revenue front-end for the work already shipped under
[github.com/gHashTag](https://github.com/gHashTag): productized **MCP server /
AI-agent integration** services, packaged so a prospect can go from landing page
→ working demo → paid build.

**Goal:** $10k/month net profit. The math is forgiving — at the pricing below,
**2–3 builds a month** clears a senior full-time income, and retainers compound
on top.

## What's here

| Path | What it is |
|------|------------|
| [`site/`](site/) | Static marketing landing page (offer, proof, pricing, lead-capture form) |
| [`mcp-starter/`](mcp-starter/) | A real, runnable MCP server (RAG over Postgres, SQLite demo fallback) — the thing you demo to close deals |
| [`GO-TO-MARKET.md`](GO-TO-MARKET.md) | Positioning, pricing logic, cold-outreach scripts, 90-day plan to $10k/mo |

## Why this niche (June 2026)

- **MCP is the integration standard** every team using Claude/Cursor/Windsurf
  now needs, and most can't build it safely themselves.
- It maps directly onto existing assets: `trios`, `trios-mcp`, `trios-mcp-rag`
  (a Rust RAG-over-Postgres MCP server) and `BrowserOS`.
- Service margins are 75–80% and you only need **3–4 clients/month**, versus
  hundreds of customers for a SaaS or store. Fastest credible path to the target.
- Optional second engine: a paid community/course teaching "AI Agents & MCP"
  (leverages the proven `jscamp` education muscle) that feeds leads into builds.

## Run the demo locally

```bash
cd site && python3 -m http.server 8080      # open http://localhost:8080
```

```bash
cd mcp-starter && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && python server.py   # seeded SQLite, zero setup
```

See [`mcp-starter/README.md`](mcp-starter/README.md) to wire it into Claude/Cursor.

## Deploy the site

It's fully static — drop `site/` on Netlify, Cloudflare Pages, GitHub Pages or
Vercel. Before going live, edit two things in `site/app.js`:

- `CONFIG.endpoint` → your form backend (Formspree / Basin / Worker), **or**
- `CONFIG.fallbackEmail` → your real inbox (used when no endpoint is set).

## Honest scope notes

- Keep the **speculative physics** (`claim-audit-lab`, φ-derived constants) and
  the **`$TRI` token / DePIN** track *off* the B2B sales surface — they hurt
  enterprise trust. Sell the engineering: agents, MCP, edge inference, RTL.
- The `mcp-starter` is intentionally minimal (keyword search, demo data). Real
  paid builds add vector retrieval, row-level auth, evals and hosting.
