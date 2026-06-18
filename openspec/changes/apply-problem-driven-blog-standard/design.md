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

The Adaptive RAG public update is implemented as:

- Part 1: why retrieval timing matters more than retrieval volume.
- Part 2: how to judge whether a retrieval gate should fire.

## Local Private Blog

The local private blog can read and display `/mnt/e/workspace/ai_projects`, but writes must stay under `local-private-blog/`. Generated project pages should highlight:

- the practical problem;
- the actionable conclusion;
- the verification loop;
- the next step or next reading path.

Raw materials remain available below the curated or synthesized reading layer.
