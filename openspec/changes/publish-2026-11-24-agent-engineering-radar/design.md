# Design: 2026-11-24 Radar Content

## Source Selection

Use public material published November 17 through November 24, 2026:

1. Pydantic AI v2.71.0 release.
2. GitHub Advisory GHSA-764m-3ppc-5m73 for the compromised `agent-framework`
   PyPI releases.
3. The c0ze agent-evaluation project's November 19 blind-pass update.

## Article Shape

Use the established frontmatter and radar sections. Separate Pydantic AI's
tool-discovery/cache controls from its permission and verification controls as
two actionable runtime signals from one release. Treat the small public
leaderboard as an evaluation-method signal, not a general capability ranking.
Treat the compromised package advisory as an immediate dependency-response
action. Each recommendation names maturity, risk, and a concrete next action.
