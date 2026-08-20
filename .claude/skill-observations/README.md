# skill-observations

Observation log for the `task-observer` skill, pinned here deliberately.

Remote Claude Code sessions run in an ephemeral container: `~/.claude/` is destroyed
when the container is reclaimed, so the default workspace path would lose the log
between sessions. Keeping it inside the repository makes it survive via git.

`log.md` is created by the skill on first observation. Commit it before ending a session.
