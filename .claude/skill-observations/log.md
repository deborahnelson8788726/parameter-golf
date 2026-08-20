# Skill Observation Log

Observations captured during task-oriented work.

**Status key:** OPEN = not yet actioned | ACTIONED (YYYY-MM-DD) = skill
updated/created | DECLINED (YYYY-MM-DD) = user decided not to pursue —
resolved statuses always carry their resolution date

---

## 2026-08-20

### Observation 1: "Stable path" guidance fails in ephemeral cloud containers

**Status:** OPEN
**Date:** 2026-08-20
**Session context:** Installing task-observer into a repository worked on from Claude Code on the web, where each session runs in a fresh container that is reclaimed afterwards.
**Skill:** task-observer
**Type:** open-source
**Phase/Area:** SKILL.md — `[workspace folder]` definition; `references/environments.md`

**Issue:** SKILL.md defines the stable workspace anchor for Claude Code as "the stable project identity (e.g. `~/.claude/projects/<project-id>/`), NOT the current working directory", and treats ephemeral checkouts (worktrees, temporary clones) as the failure case to avoid. In a remote/cloud Claude Code session the relationship inverts: the entire filesystem, `~/.claude/` included, is destroyed when the container is reclaimed, while the git checkout is the only thing that can persist — but only for content that is committed and pushed. Following the documented guidance literally would place the log on the one path guaranteed to be lost. `references/environments.md` covers activation, compaction and storage-less handoff mode, but has no entry for "filesystem exists but is ephemeral", which is a distinct third case.

**Suggested improvement:** Add an environment class to `references/environments.md` for ephemeral remote containers (Claude Code on the web, CI runners, cloud dev sandboxes), and qualify the SKILL.md anchor rule: the anchor must be the most durable store available in the environment, which is version control when no path outlives the session. Include the accompanying requirement that makes it work — the log must be committed before the session ends, since an uncommitted log in an ephemeral container is equivalent to no log at all. Note that this is a third mode alongside filesystem and handoff-doc: storage exists and is writable, but durability comes from an explicit commit action rather than from the path.

**Principle:** Persistence guidance must name the durability mechanism, not a path. When a path's stability is an environment property rather than a universal one, guidance anchored on the path silently inverts in environments that violate the assumption — and the failure is invisible, because writes succeed right up until the state is discarded.

### Observation 2: Third-party install instructions cited layouts that the repository does not have

**Status:** OPEN
**Date:** 2026-08-20
**Session context:** Working from a user-supplied summary document that listed five tools with install commands, then installing one of them.
**Skill:** New skill candidate: vendoring-third-party-components
**Type:** open-source
**Phase/Area:** Pre-install verification

**Issue:** The summary's install command was `cp -r one-skill-to-rule-them-all/task-observer ~/.claude/skills/`, but the repository has no `task-observer` subdirectory — `SKILL.md` and `references/` sit at the repository root. Run verbatim, `cp` would have failed outright, which is the benign outcome; a subtly wrong path that partially succeeds is the dangerous one. The same document also described a tool as proxy-only when it additionally ships an MCP-server mode, which materially changed the recommendation. Both errors came from a plausible-sounding secondhand summary rather than the primary source, and neither was detectable without fetching the repository.

**Suggested improvement:** Before executing any install or vendoring step sourced from a summary, blog post, or video, list the actual artifact — repository tree, package contents — and reconcile it against the instructions. Verify three things specifically: the real directory layout, the complete bundle manifest (a skill or package is often more than its entry file), and the full set of operating modes, since a summary that omits one mode can invert the recommendation. Record what was verified against the primary source and what was carried over unverified.

**Principle:** Secondhand install instructions are a hypothesis about a repository's layout, not a description of it. Verify structural claims against the artifact before executing them, and track which claims were verified — an unmarked mix of checked and unchecked assertions degrades into all-unchecked over time.
