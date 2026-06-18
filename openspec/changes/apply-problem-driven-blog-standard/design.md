# Design: Problem-Driven Blog Standard

## Writing Rules

Each technical essay should answer four questions in order:

1. What practical problem forces this topic to matter?
2. What is the smallest useful abstraction for the problem?
3. What engineering loop can make the abstraction observable and testable?
4. What direct conclusion should the reader take into implementation?

For split topics, the current article should stop at a natural conclusion instead of adding a long roadmap section. The tail should link to the next concrete article or a local knowledge-search path.

## Public Blog

Public posts under `source/_posts` may only use public-safe technical discussion. They must not include local paths, private project names, internal business context, unpublished notes, raw dialogue records, or implementation details that reveal private ideas.

The public update is implemented as a full-site content pass:

- Legacy ASR and BCI notes become problem-driven foundation articles.
- The 2026 AI engineering posts become a connected technical series.
- Operational posts, including Hexo/GitHub setup and Agent Engineering Radar, keep their original purpose but follow the same problem-chain style.
- Every public post ends with a direct conclusion and, where useful, a next-reading link to an existing generated page.

## Local Private Blog

The local private blog can read and display `/mnt/e/workspace/ai_projects`, but writes must stay under `local-private-blog/`. Generated project pages should highlight:

- the practical problem;
- the actionable conclusion;
- the verification loop;
- the next step or next reading path.

Raw materials remain available below the curated or synthesized reading layer.

Each local project page should also have a short curated guide that names the practical problem, the smallest abstraction, the verification loop, the direct conclusion, and the next local review path. This guide may be generated from local project context and must remain local-only.
