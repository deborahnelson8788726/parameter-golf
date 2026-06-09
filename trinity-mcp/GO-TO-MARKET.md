# Go-to-market: MCP / AI-agent services → $10k/month net

A concrete operating plan, not theory. Numbers are realistic for a senior solo
engineer with public proof of work (you have it).

## The offer (one sentence)

> "I connect your data and internal tools to the AI your team already uses
> (Claude, Cursor, Windsurf) with a production-grade MCP server — typed, auth'd,
> audited — usually shipped in 1–2 weeks."

## Pricing & the path to $10k/mo net

| Package | Price | Effort | Notes |
|---|---|---|---|
| MCP Server Build | **$3,500** | 1–2 wks | One data source/tool |
| Agent Integration | **$6,500** | 2–4 wks | RAG + multi-tool + evals |
| Fractional AI Engineer | **$4k–8k/mo** | retainer | Recurring, compounding |

Margins are ~75–80% (your time + cheap infra). **Routes to ~$10k/mo net:**

- **2 Agent Integrations/mo** ($13k gross) → ~$10k net, *or*
- **1 build + 1 retainer** ($6.5k + $5k) → steady recurring base, *or*
- **3 small builds/mo** ($10.5k gross) as you ramp.

Target ramp: first paid build in **30–45 days**, steady $10k/mo in **4–9 months**.

## The lead magnet: free "AI-Agent Readiness Audit"

The single best converter. For each prospect, deliver a 1-page report:
1. The highest-leverage thing to connect first.
2. Data/security gotchas (auth, PII, write-access).
3. A fixed-price quote.

It's demonstrable, low-effort with the `mcp-starter` demo, and it reframes the
sale from "should we?" to "what first?".

## Where clients come from (ranked)

1. **Warm + community.** Your GitHub, the 4 orgs you're in, MCP/Claude/Cursor
   Discords and subreddits, Indie Hackers. Post the demo, offer free audits.
2. **Signal-based cold outreach.** Find teams publicly using Cursor/Claude (job
   posts mentioning them, "we use Cursor" tweets, YC companies). A personalized
   audit hook gets **15–25% replies** vs ~3% generic.
3. **Content wedge.** Short "I wired X into Claude in 20 min" build logs
   (YouTube/X/LinkedIn). Each becomes a sales asset and SEO entry.
4. **Marketplaces / directories.** List on MCP server directories and
   AI-freelance boards (Toptal/Contra/Upwork) to catch inbound intent.

## Cold-outreach templates

**Email (signal: they posted a Cursor/Claude job):**

> Subject: agents that can actually read your {{system}}
>
> Hi {{name}} — saw {{company}} is leaning on {{Cursor/Claude}}. Most teams hit
> the same wall fast: the model can't safely touch their real data (Postgres,
> internal APIs). I build the MCP layer that fixes that — typed, permissioned,
> audited, usually live in a week or two.
>
> Want a free 1-page readiness audit? Tell me the one thing you'd want an agent
> to do and I'll send back the fastest path + a fixed quote. No pitch.
>
> Recent work: github.com/gHashTag (trios, trios-mcp-rag, BrowserOS).

**DM (community):**

> Built a tiny open MCP server that does RAG over Postgres — runs in 10 min:
> {{repo link}}. If anyone wants theirs wired into Claude/Cursor on real data,
> I do free readiness audits this week — happy to look at your setup.

## 90-day plan

**Weeks 1–2 — Asset & positioning**
- Deploy the landing page (`site/`); set form endpoint; add real email.
- Polish `mcp-starter` README; record a 3-min Loom of the demo working in Cursor.
- Write the 1-page audit template.

**Weeks 2–6 — Pipeline**
- 30–50 personalized outreach touches/week (signal-based).
- 1 build-log post/week to community + X/LinkedIn.
- Offer 5–10 free audits → aim for first 1–2 paid builds.

**Months 2–4 — Deliver & prove**
- Ship builds, capture 2–3 named case studies (with metrics: time-to-ship,
  hours saved).
- Convert at least one client to a retainer.

**Months 4–9 — Compound**
- Raise prices as case studies land.
- Stand up the optional **paid community/course** ("Build AI Agents & MCP") to
  generate inbound leads and a second revenue line (200 members × $39–59/mo ≈
  $8–12k/mo at ~90% margin).

## Guardrails

- Keep speculative physics and the `$TRI` token **out** of B2B materials.
- Fixed scope, fixed price; change orders for anything new. Protects margin.
- Always ship the client full source + docs — "no lock-in" closes deals and
  referrals more than retainer pressure loses.
