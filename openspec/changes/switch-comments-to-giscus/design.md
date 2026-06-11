# Design

## Comment Provider
Use Giscus because it stores comment threads in GitHub Discussions and keeps the GitHub Pages site static. The repository is public and the repo node id is stored in theme config. The category id is intentionally left as a configuration value because it is only available after Discussions and a category exist.

## NexT Integration
The current NexT 8.27 package has built-in Utterances filters but no local Giscus filter. Add a site-level Hexo script under `scripts/` that registers a `theme_inject` filter and injects the Giscus embed at NexT's `comment` injection point. This avoids editing `themes/next`, which is ignored and can be relinked during upgrades.

## Incomplete Configuration
If `repo`, `repo_id`, `category`, or `category_id` is missing, the injector should not load `https://giscus.app/client.js`. It should emit a lightweight `giscus-config-pending` marker so generated-site checks can confirm the provider switch without showing a broken public iframe.

## Verification
Build output must contain the Giscus provider marker or embed, must not contain Utterances as the active provider, and must continue passing the existing generated-site checks and OpenSpec validation.
