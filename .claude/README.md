# Claude Code tooling — what we run and why

This directory is **Claude-specific** config (settings, skills, hooks). Keep it out
of the shared, provider-neutral `docs/` — that's the repo's neutrality rule.

- **MCP servers** are provider-neutral and documented once in
  [`docs/agents.md` §3](../docs/agents.md) — don't duplicate them here.
- **Claude Code plugins** are Claude-specific, so they're tracked here. Enabled in
  [`settings.json`](./settings.json) (`enabledPlugins` + `extraKnownMarketplaces`).

To add a plugin: justify it against a real task class in the table below, then enable
it in `settings.json` so teammates get it too.

## Plugins

| Plugin | Marketplace | Why it's here |
|---|---|---|
| **ponytail** | `DietrichGebert/ponytail` | laziness/anti-over-engineering reflex on every coding task — smallest diff that works |
| **superpowers** | `claude-plugins-official` | process skills: brainstorming, systematic-debugging, TDD, plan writing/execution |
| **mattpocock-skills** | `claude-plugins-official` | TS-focused skills: tdd, diagnosing-bugs, code-review, domain-modeling |
| **impeccable** | `pbakaus/impeccable` | design-quality gate for bragi's UI — 61 "AI slop" checks + design commands |
| **i-have-adhd** | `ayghri/i-have-adhd` | focus/workflow assist |

User-scoped plugins (e.g. `frontend-design`) are intentionally **not** enabled at
project scope — they're personal, not part of the repo's shared contract.
