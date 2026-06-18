# Proposal: Apply Problem-Driven Blog Writing Standard

## Summary

Update the entire public Hexo blog and the local private review blog to follow the new writing standard established by the Adaptive RAG sample: start from a real problem, keep the article as a coherent reasoning chain, avoid over-splitting, close with a direct conclusion, and add a concrete next-article or next-reading link where the topic is split.

## Scope

- Refresh all public posts under `source/_posts` into problem-driven articles.
- Keep legacy technical images and references where they carry the original technical value.
- Add next-reading links between related posts so the public blog has navigable learning paths.
- Update local private blog generation so every project page exposes problem-chain review lenses and a curated project guide rather than only broad listing cards.
- Keep the public/private content boundary strict.

## Non-goals

- Do not copy private `ai_projects` source material into `source/_posts`.
- Do not modify `/mnt/e/workspace/ai_projects`.
- Do not archive older OpenSpec changes in this pass.
- Do not rewrite public posts from private-only project details.
