# Tool evaluations

Tools that were considered for this repository, measured, and decided on. Recorded so the
same evaluation is not repeated from scratch later. A "no" here is about fit with this
repository, not about the tool's quality.

## graphify — declined (2026-08-26)

[Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify), `pip install graphifyy`,
v0.9.50 at time of testing. A `/graphify` skill for Claude Code and other assistants that turns
a codebase into a queryable knowledge graph: tree-sitter AST parsing, deterministic, no LLM and
no vector store for the code pass, output as `graph.json` / `graph.html` / `GRAPH_REPORT.md`.
The pitch is that an agent queries the graph instead of grepping and reading files, which cuts
the tokens a broad question costs.

**Tested for real** on a copy of this repository: `graphify update .` parsed 105 files and built
2495 nodes, 4718 edges, 128 communities, at zero token cost. It works exactly as advertised.

**It does not fit this repository**, because the value depends on cross-file structure that this
repository does not have:

| Measurement | Result |
|---|---|
| Edges within a single file | 3551 |
| Edges between different files | **54** |
| Internal (repo-local) imports | **0** of 28 unique imports |
| Nodes originating in `records/` | 2241 of 2495 (89%) |
| Communities detected | one per file, essentially the file listing |
| Largest single "concept" | `.__init__`, 113 nodes — the same constructor from 24 copies |

`records/` holds 24 self-contained variants of the same ~2000-line training script. Nothing
imports anything else in the repo, so the graph is two dozen disconnected islands whose
community structure reproduces `ls records/`. Traversing that graph tells you nothing that the
directory listing does not.

Note the tool's own report says "corpus is large enough that graph structure adds value" — that
verdict is computed from word count (~266k words), not from connectivity, so it does not
contradict the measurements above.

**Where it would fit instead:** a repository with real internal structure — many modules
importing each other, where "what calls this and what breaks if I change it" spans files. If
such a project comes up, revisit this; the tool is sound, the shape of this repository is the
problem.

**Note on the project:** the OSS CLI is free and fully local for code, and is the entry point to
a hosted commercial product (Graphify Labs, YC S26). That does not affect the measurements, but
it is worth knowing that the always-on version is the paid path.
