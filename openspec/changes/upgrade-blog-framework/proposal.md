# Upgrade Blog Framework

## Summary
Upgrade the Hexo blog source project to a current, reproducible framework stack that runs inside the WSL Conda environment `alanfangblog`.

## Motivation
The current source project uses Hexo 5-era dependencies and stale generated state. The older `D:\workspace\github\blog` copy cannot build reliably on modern Node, and the newer `E:\workspace\github\MyBlog\blog` copy is closer to production but still needs a maintained dependency set, clear scripts, and build validation before publishing.

## Scope
- Pin the project to the WSL Conda environment `alanfangblog` with Node.js 22.
- Upgrade Hexo and maintained plugins/renderers to versions compatible with Node 22.
- Replace deprecated or abandoned renderers where practical without changing post URLs.
- Add project scripts for clean, generate, serve, and list workflows.
- Fix build/runtime issues discovered during validation.
- Preserve existing source content, permalink structure, theme selection, CNAME, and generated site behavior unless a bug fix requires a narrow change.
- Restore the two remote-only posts currently present on `alanfangblog.com` so publishing the upgraded build keeps post parity with production.
- Publish the regenerated static site to the GitHub Pages repository only after the local source can produce all 11 production posts.

## Non-Goals
- Do not rewrite article content except when required to fix rendering/build errors.
- Do not reconstruct content beyond the two online-only posts needed to avoid deleting production pages.
- Do not redesign the visual theme.

## Risks
- Hexo 8 can expose theme or renderer incompatibilities from the older NexT theme.
- Publishing remains unsafe if the regenerated site does not preserve the 11-post production count.
- Windows and WSL path behavior can differ for generated files and asset links.
