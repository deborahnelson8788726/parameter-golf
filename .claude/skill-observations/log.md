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

### Observation 3: Aggregated comparisons listed a service that had been retired for three weeks

**Status:** OPEN
**Date:** 2026-08-20
**Session context:** Surveying free LLM API tiers available to the project, using published comparison articles as the starting point.
**Skill:** New skill candidate: vendoring-third-party-components
**Type:** open-source
**Phase/Area:** Verification of volatile facts

**Issue:** Every comparison source consulted — including a provider blog post and several 2026-dated roundups — listed GitHub Models as an available free tier with specific rate limits. The service had been fully retired on 2026-07-30, three weeks before the session. A live probe of both documented endpoints returned 410 Gone, which is what surfaced the retirement; the discrepancy was then confirmed against the vendor's own changelog. Had the survey been written from the articles alone, it would have recommended a dead service with confident-looking numbers attached.

**Suggested improvement:** For facts with a short half-life — service availability, pricing, rate limits, model catalogs — treat aggregated summaries as a candidate list to probe, never as the answer. Probe each candidate directly (an unauthenticated request distinguishes reachable-but-unauthenticated from gone), and confirm anything anomalous against the vendor's own changelog or status page before reporting. Separate probe-verified claims from summary-sourced ones in the output so the reader knows which numbers carry which confidence. Note also that a provider's own comparison of competitors is not a neutral source.

**Principle:** Aggregated summaries decay silently: they are written once and keep asserting the same facts long after those facts expire, with no signal that anything changed. A cheap direct probe of the primary source is worth more than agreement among several secondhand sources, because those sources are correlated — they copy each other, so consensus among them is not independent confirmation.

### Observation 4: A component that initializes cleanly can still be non-functional

**Status:** OPEN
**Date:** 2026-08-20
**Session context:** Evaluating five MCP servers recommended in a social-media video before enabling them for the project.
**Skill:** New skill candidate: vendoring-third-party-components
**Type:** open-source
**Phase/Area:** Verification depth

**Issue:** Two of the five servers passed every structural check — the package resolved, the process started, the handshake succeeded, and the tool list came back populated — while being unable to do the thing they exist for. One returned its tool list and then stalled indefinitely on a real call, because the upstream service was answering HTTP 200 with a quota-exceeded body that the server neither surfaced nor failed on; the symptom presented as a hang, which reads as a local problem rather than an upstream refusal. The other exposed 24 working tools around a browser that could not open a single page. Both would have been reported as working if verification had stopped at the tool list, and the first would have been misdiagnosed as a broken install without querying the upstream API directly.

**Suggested improvement:** Treat a successful handshake and tool listing as proof of installation, not of function. Verification must include one real call that exercises the component's actual purpose — fetch a document, load a page, return a result. When such a call hangs, query the upstream service directly before concluding the component is at fault: a 200 response carrying an error body is a common failure that hangs clients instead of erroring them. Record which layer each verification reached, so "installed" is never reported as "working".

**Principle:** Initialization and function are independent properties. Startup checks answer whether a thing was assembled, never whether it works — and a component that fails only at the point of real use will pass every structural test right up until it is depended on.

### Observation 5: Documented environment capabilities need probing before they are relied on

**Status:** OPEN
**Date:** 2026-08-20
**Session context:** Deciding whether a browser-automation server could be enabled in a managed remote container.
**Skill:** New skill candidate: vendoring-third-party-components
**Type:** open-source
**Phase/Area:** Environment assumptions

**Issue:** The environment's own documentation stated that a browser was pre-installed and the automation framework pre-configured, with explicit guidance on how to point at the bundled binary. All of that was accurate — the binary existed and ran, reporting its version. What the documentation did not say, and could not be inferred from it, was that the browser had no network egress: every navigation failed with a connection reset, with and without the session proxy, and the proxy logged no connection attempt for the target host at all. The capability was present and simultaneously unusable, and only a real navigation revealed the gap.

**Suggested improvement:** When an environment advertises a capability that a plan depends on, probe the specific operation the plan needs rather than the capability's presence. Presence checks (binary exists, version prints, config is set) and permission checks (can it actually reach what it needs) are separate questions, and platform documentation typically answers only the first. Where a probe shows the capability is present but restricted by policy, record it as a policy boundary and stop — it is not a misconfiguration to work around from inside the sandbox.

**Principle:** Documentation describes what was installed; it rarely describes what is permitted. In managed environments the gap between the two is where plans silently fail, and only an end-to-end probe of the intended operation distinguishes them.

### Observation 6: The recommended integration path was the broken one; an alternate path worked

**Status:** OPEN
**Date:** 2026-08-20
**Session context:** Enabling a documentation service whose stdio wrapper hung on every real call, after obtaining an API key that was confirmed valid.
**Skill:** New skill candidate: vendoring-third-party-components
**Type:** open-source
**Phase/Area:** Diagnosis when a component fails

**Issue:** A service was nearly written off as unusable because its npm package — the integration path every guide and the vendor's own quickstart recommends — completed its handshake and then hung on every real call, before and after a valid key was supplied. Inspecting the package's compiled source for the hosts it contacts revealed it was a thin client for a hosted endpoint on a different subdomain. Called directly, that endpoint served the identical requests in under three seconds. The failure was in the wrapper, not the service, and no amount of further debugging on the key or the network would have found that, because both were fine.

**Suggested improvement:** When a component fails at the point of real use and the obvious causes (credentials, connectivity, arguments) all check out, enumerate the service's other integration paths before concluding it is unusable — a hosted endpoint, a REST API, a different transport. Reading the failing client for the hosts and paths it actually contacts is a fast way to find them, and it also tells you what to probe directly to split "the client is broken" from "the service is broken". Prefer the path that works over the path that is recommended, and record why the deviation exists so it is not silently reverted later.

**Principle:** A failing client is not a failing service. Popular integration paths accumulate recommendations faster than they accumulate correctness, so when the documented path fails at the point of use, treat it as one implementation among several rather than as the service itself.
