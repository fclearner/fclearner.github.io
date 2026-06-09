## Context

The maintained source tree is `E:\workspace\github\MyBlog\blog`, a Hexo blog using the NexT theme. It currently has 9 source posts, a generated `public/` directory, a deployment cache in `.deploy_git/`, and dependencies from the Hexo 5 era. WSL has a new Conda environment, `alanfangblog`, with Node.js 22.22.3 and git.

The live site at `alanfangblog.com` appears to contain more content than the local source tree. This upgrade must therefore make the local project buildable without treating deployment as safe.

## Goals / Non-Goals

**Goals:**
- Run all blog maintenance commands through the `alanfangblog` Conda environment.
- Upgrade the Hexo framework and first-party plugins to current maintained versions compatible with Node 22.
- Replace the deprecated markdown renderer with the maintained Hexo renderer while preserving post permalinks and source content.
- Add project scripts that make clean, generate, serve, and listing workflows discoverable.
- Fix configuration bugs that affect canonical URLs or local build correctness.
- Validate the result with Hexo list/generate checks and OpenSpec validation.

**Non-Goals:**
- Publishing to GitHub Pages.
- Recovering the missing live-site posts.
- Redesigning the NexT theme or migrating to another static site generator.
- Rewriting article prose or changing permalink structure.

## Decisions

1. Use Hexo 8 on Node 22.
   - Rationale: npm currently reports Hexo 8.1.2 with a Node requirement of `>=20.19.0`; the new Conda environment satisfies that requirement.
   - Alternative considered: keep Hexo 5. That would reduce migration risk but leave the framework stale and does not meet the requested framework update.

2. Keep the existing NexT theme initially.
   - Rationale: the request is to update and stabilize the blog framework, not redesign the site. Keeping the theme limits visual drift and preserves generated paths.
   - Alternative considered: migrate to a newer theme package. That would be a larger redesign and should be handled separately after source-content parity is resolved.

3. Replace `hexo-renderer-kramed` with `hexo-renderer-marked`.
   - Rationale: `kramed` is an old renderer path; Hexo's maintained markdown renderer is the safer default for modern Hexo.
   - Alternative considered: keep `kramed` for compatibility. That would keep an obsolete dependency in the upgraded framework.

4. Treat deployment as explicitly out of scope.
   - Rationale: local source has 9 posts while the live site appears to have more; accidental deploy could remove online-only content.
   - Alternative considered: run `hexo deploy` after build. This is unsafe until content parity is verified.

## Risks / Trade-offs

- Hexo 8 may expose incompatibilities in the bundled legacy NexT theme -> validate with `hexo list post`, `hexo clean`, and `hexo generate`; fix theme/config issues narrowly.
- Renderer changes can alter markdown output -> preserve source markdown and inspect generated pages for key posts.
- Generated caches can mask source changes -> use `hexo clean` before `hexo generate`.
- Local source is not production-complete -> keep deployment scripts available but do not run deployment in this change.

## Migration Plan

1. Create the WSL Conda environment `alanfangblog` with Node 22 and git.
2. Update `package.json` dependency and script metadata.
3. Regenerate `package-lock.json` through npm inside `alanfangblog`.
4. Run clean/list/generate validation and fix failures.
5. Document the environment and publish-safety constraints.

Rollback: restore `package.json`, `package-lock.json`, generated output, and OpenSpec change files from backup or version control before deployment. No remote deploy is performed by this change.
