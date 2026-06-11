# Design

## Search
Use NexT local search with a generated static search index. The Hexo build creates `search.xml`; the browser loads the index and performs searching client-side. This keeps the GitHub Pages deployment fully static and does not require a database, API service, crawler, or external SaaS.

## Comments
Do not self-host comments yet. For a static GitHub Pages blog, the practical choices are:

- `utterances`: GitHub Issues backed, no database, requires installing the Utterances GitHub App on the target repo.
- `giscus`: GitHub Discussions backed, no database, requires enabling Discussions and installing/configuring Giscus. NexT 8.27 has built-in Utterances support but not native Giscus wiring in the current local theme package.
- `isso` or `remark42`: self-hosted, requires service plus database/storage and operational maintenance.

This change enables the built-in NexT `utterances` integration and stores comments in GitHub Issues for the public Pages repository. The remaining external prerequisite is installing the Utterances GitHub App on that repository and keeping Issues enabled.

## Verification
Build output must contain `search.xml`, the NexT search trigger, client-side local-search configuration, an Utterances comment container on post pages, and the NexT Utterances loader script. Verification must not require posting a live comment.
