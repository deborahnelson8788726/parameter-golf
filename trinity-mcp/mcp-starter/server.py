#!/usr/bin/env python3
"""
Trinity MCP Starter — RAG over your database, exposed to Claude / Cursor / Windsurf.

This is the demo product behind the landing page: a small but production-shaped
MCP server that gives an AI agent safe, audited, read/write access to a document
store. It runs against PostgreSQL in production and falls back to a seeded
SQLite database so a prospect can see it working in under 10 minutes with zero
setup.

Tools exposed to the model:
  - list_docs       : list documents with metadata
  - search_docs     : keyword-ranked search over titles + bodies
  - get_doc         : fetch one document in full by id
  - add_doc         : ingest a new document (write path, audit-logged)

Configure with environment variables (all optional for the demo):
  DATABASE_URL   postgres://user:pass@host:5432/db   -> use Postgres
                 (unset)                              -> use ./trinity_demo.db (SQLite)
  ALLOW_WRITES   "1" (default) to enable add_doc, "0" for read-only deployments
  AUDIT_LOG      path to a JSONL audit file (default: ./mcp_audit.jsonl)
"""

from __future__ import annotations

import json
import os
import re
import sqlite3
import sys
import time
from dataclasses import dataclass

try:
    from mcp.server.fastmcp import FastMCP
except ImportError:  # pragma: no cover - helpful message instead of a traceback
    sys.stderr.write(
        "Missing dependency: install with `pip install -r requirements.txt`\n"
    )
    raise

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
ALLOW_WRITES = os.environ.get("ALLOW_WRITES", "1") == "1"
AUDIT_LOG = os.environ.get("AUDIT_LOG", "mcp_audit.jsonl")
SQLITE_PATH = os.environ.get("SQLITE_PATH", "trinity_demo.db")

mcp = FastMCP("trinity-rag")


# --------------------------------------------------------------------------- #
# Audit log — every tool call is appended as one JSON line. This is the kind   #
# of trail real clients need and off-the-shelf wrappers never provide.         #
# --------------------------------------------------------------------------- #
def audit(tool: str, args: dict, result_summary: str) -> None:
    record = {
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "tool": tool,
        "args": args,
        "result": result_summary,
    }
    try:
        with open(AUDIT_LOG, "a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")
    except OSError:
        pass  # never let logging break a tool call


# --------------------------------------------------------------------------- #
# Storage backend — Postgres if DATABASE_URL is set, else seeded SQLite.       #
# --------------------------------------------------------------------------- #
@dataclass
class Doc:
    id: int
    title: str
    body: str
    kind: str


class Backend:
    """Tiny abstraction over Postgres / SQLite so the tools stay backend-agnostic."""

    def __init__(self) -> None:
        self.is_pg = bool(DATABASE_URL)
        if self.is_pg:
            import psycopg  # imported lazily; only needed in PG mode

            self.conn = psycopg.connect(DATABASE_URL, autocommit=True)
            self._ph = "%s"
        else:
            self.conn = sqlite3.connect(SQLITE_PATH, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row
            self._ph = "?"
        self._ensure_schema()

    def _ensure_schema(self) -> None:
        cur = self.conn.cursor()
        if self.is_pg:
            cur.execute(
                """CREATE TABLE IF NOT EXISTS docs (
                       id SERIAL PRIMARY KEY,
                       title TEXT NOT NULL,
                       body TEXT NOT NULL,
                       kind TEXT NOT NULL DEFAULT 'note'
                   )"""
            )
        else:
            cur.execute(
                """CREATE TABLE IF NOT EXISTS docs (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       title TEXT NOT NULL,
                       body TEXT NOT NULL,
                       kind TEXT NOT NULL DEFAULT 'note'
                   )"""
            )
            cur.execute("SELECT COUNT(*) AS n FROM docs")
            if cur.fetchone()["n"] == 0:
                self._seed(cur)
        if not self.is_pg:
            self.conn.commit()

    def _seed(self, cur) -> None:
        samples = [
            ("Refund policy", "Customers may request a refund within 30 days of purchase. "
             "Digital goods are refundable only if unused. Process refunds via the billing dashboard.", "policy"),
            ("Onboarding checklist", "1) Create workspace 2) Invite team 3) Connect data source "
             "4) Run the readiness audit 5) Ship first agent tool.", "guide"),
            ("Postgres connection notes", "Use a read-replica for agent traffic. Grant SELECT on the "
             "reporting schema only. Rotate the agent role password monthly.", "ops"),
            ("MCP overview", "The Model Context Protocol lets an LLM call typed tools over JSON-RPC. "
             "Each tool declares its inputs so the model cannot send malformed requests.", "reference"),
            ("Pricing FAQ", "An MCP server build starts at $3,500 for one data source. Agent integrations "
             "with RAG start at $6,500. Retainers run $4k-8k per month.", "faq"),
        ]
        cur.executemany("INSERT INTO docs (title, body, kind) VALUES (?, ?, ?)", samples)

    def all_docs(self) -> list[Doc]:
        cur = self.conn.cursor()
        cur.execute("SELECT id, title, body, kind FROM docs ORDER BY id")
        return [self._row(r) for r in cur.fetchall()]

    def get(self, doc_id: int) -> Doc | None:
        cur = self.conn.cursor()
        cur.execute(f"SELECT id, title, body, kind FROM docs WHERE id = {self._ph}", (doc_id,))
        row = cur.fetchone()
        return self._row(row) if row else None

    def insert(self, title: str, body: str, kind: str) -> int:
        cur = self.conn.cursor()
        if self.is_pg:
            cur.execute(
                "INSERT INTO docs (title, body, kind) VALUES (%s, %s, %s) RETURNING id",
                (title, body, kind),
            )
            new_id = cur.fetchone()[0]
        else:
            cur.execute(
                "INSERT INTO docs (title, body, kind) VALUES (?, ?, ?)", (title, body, kind)
            )
            self.conn.commit()
            new_id = cur.lastrowid
        return int(new_id)

    @staticmethod
    def _row(r) -> Doc:
        return Doc(id=r["id"], title=r["title"], body=r["body"], kind=r["kind"])


_backend: Backend | None = None


def backend() -> Backend:
    global _backend
    if _backend is None:
        _backend = Backend()
    return _backend


# --------------------------------------------------------------------------- #
# Lightweight keyword ranking — good enough for a demo and dependency-free.     #
# Swap for pgvector / full-text search in a real engagement.                    #
# --------------------------------------------------------------------------- #
def score(doc: Doc, terms: list[str]) -> int:
    hay = (doc.title + " " + doc.body).lower()
    s = 0
    for t in terms:
        s += hay.count(t) + (3 if t in doc.title.lower() else 0)
    return s


# --------------------------------------------------------------------------- #
# MCP tools                                                                     #
# --------------------------------------------------------------------------- #
@mcp.tool()
def list_docs() -> str:
    """List all documents with id, title and kind. Use to see what is available."""
    docs = backend().all_docs()
    audit("list_docs", {}, f"{len(docs)} docs")
    lines = [f"[{d.id}] ({d.kind}) {d.title}" for d in docs]
    return "\n".join(lines) if lines else "No documents yet."


@mcp.tool()
def search_docs(query: str, limit: int = 5) -> str:
    """Search documents by keywords, ranked by relevance. Returns snippets with ids."""
    terms = [t for t in re.split(r"\W+", query.lower()) if t]
    if not terms:
        return "Empty query."
    ranked = sorted(backend().all_docs(), key=lambda d: score(d, terms), reverse=True)
    hits = [d for d in ranked if score(d, terms) > 0][: max(1, min(limit, 20))]
    audit("search_docs", {"query": query, "limit": limit}, f"{len(hits)} hits")
    if not hits:
        return f"No matches for: {query}"
    out = []
    for d in hits:
        snippet = d.body[:160] + ("…" if len(d.body) > 160 else "")
        out.append(f"[{d.id}] {d.title} ({d.kind})\n    {snippet}")
    return "\n".join(out)


@mcp.tool()
def get_doc(doc_id: int) -> str:
    """Fetch the full content of one document by its id."""
    d = backend().get(doc_id)
    audit("get_doc", {"doc_id": doc_id}, "found" if d else "missing")
    if not d:
        return f"No document with id {doc_id}."
    return f"# {d.title}  ({d.kind})\n\n{d.body}"


@mcp.tool()
def add_doc(title: str, body: str, kind: str = "note") -> str:
    """Add a new document to the store. Disabled when ALLOW_WRITES=0."""
    if not ALLOW_WRITES:
        return "Writes are disabled on this server (read-only deployment)."
    if not title.strip() or not body.strip():
        return "Both title and body are required."
    new_id = backend().insert(title.strip(), body.strip(), kind.strip() or "note")
    audit("add_doc", {"title": title, "kind": kind}, f"created id {new_id}")
    return f"Created document [{new_id}] {title}"


if __name__ == "__main__":
    mode = "PostgreSQL" if DATABASE_URL else f"SQLite ({SQLITE_PATH}, seeded demo data)"
    sys.stderr.write(f"trinity-rag MCP server starting · backend: {mode}\n")
    mcp.run()
