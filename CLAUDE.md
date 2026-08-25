# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Fork of **OpenAI Model Craft Challenge: Parameter Golf** — train the best language
model that fits in a **16MB artifact** and trains in **under 10 minutes on 8xH100s**,
scored by compression on the FineWeb validation set (tokenizer-agnostic, bits per byte).
Lower `val_bpb` is better; the current leaderboard best is ~1.1147.

- `train_gpt.py` / `train_gpt_mlx.py` — starting-point baselines, **not** SOTA configs.
  Hard constraint: neither file may exceed **1500 lines** (keeps them readable for newcomers).
- `records/track_10min_16mb/` — competitive submissions (one dated folder each, with a README).
- `records/track_non_record_16mb/` — submissions that exceed the compute limit.
- `data/` — preprocessing and tokenizer specs. Datasets and tokenizers are gitignored.

Competitive work belongs in `records/`, not in the baseline scripts.

## Working conventions

- The maintainer communicates in **Russian**; repository files stay in English.
- No GPUs in remote web sessions — training runs happen on the maintainer's own hardware.
  Do not attempt full training runs here; analysis, code changes, and small CPU checks only.
- This repo is a fork. Keep diffs against upstream minimal and scoped, in case changes
  are ever proposed upstream.

## Session persistence (important)

Remote Claude Code sessions run in an **ephemeral container**: the repository is cloned
fresh at start, and everything outside git is destroyed when the container is reclaimed.

**Only committed files survive.** Anything worth keeping — notes, observation logs,
generated artifacts — must be committed and pushed before the session ends.

## MCP servers

Configured in `.mcp.json`; what each one is, what was verified, and why two are documented
but not enabled: `.claude/mcp-servers.md`.

`context7` needs a free `CONTEXT7_API_KEY` in the environment — without it the anonymous
quota is normally already spent and calls hang instead of erroring. `playwright` starts but
cannot reach the network in remote sessions (browser egress is blocked); use `WebFetch` there.

## Task Observer

At the start of any task-oriented session — any interaction where you will
use tools and produce deliverables — invoke the task-observer skill before
beginning work. This ensures skill improvement opportunities are captured
throughout the session.

When loading any skill, check the observation log for OPEN observations
tagged to that skill. Apply their insights to the current work, even if
the skill file hasn't been updated yet. This enables immediate application
of observations before they're permanently integrated during the weekly
review.

### Workspace folder — pinned

The skill expects `[workspace folder]` to be a **stable path that outlives individual
sessions**. In this environment no such path exists outside git, so it is pinned to the
repository itself:

- `[workspace folder]` = `.claude/` (this repo)
- Observation log = `.claude/skill-observations/log.md`
- Proposed skill updates = `.claude/skill-updates/`

Do **not** write the log to `~/.claude/projects/<project-id>/` here — that path is wiped
with the container and the log would be lost.

**Before ending a session, commit anything written under `.claude/skill-observations/`
or `.claude/skill-updates/`.** An uncommitted observation log does not exist.

The skill lives at `.claude/skills/task-observer/` (`SKILL.md` plus `references/`).
Created by Eoghan Henn / Rebelytics, licensed CC BY 4.0 —
source: https://github.com/rebelytics/one-skill-to-rule-them-all
