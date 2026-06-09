## 1. Environment And Baseline

- [x] 1.1 Create WSL Conda environment `alanfangblog` with Node.js 22 and git
- [x] 1.2 Confirm the target source tree is `E:\workspace\github\MyBlog\blog`
- [x] 1.3 Confirm deployment is unsafe because local source has fewer posts than the live site

## 2. Framework Upgrade

- [x] 2.1 Update `package.json` scripts for clean, generate, serve, list, and doctor workflows
- [x] 2.2 Upgrade Hexo and maintained plugins/renderers for Node.js 22 compatibility
- [x] 2.3 Remove obsolete markdown renderer usage and regenerate `package-lock.json`

## 3. Bug Fixes And Cleanup

- [x] 3.1 Fix site configuration bugs such as canonical URL pointing at `yoursite.com`
- [x] 3.2 Fix build/runtime errors reported by modern Hexo
- [x] 3.3 Add lightweight project documentation for the WSL Conda workflow and publish guard

## 4. Verification

- [x] 4.1 Run dependency installation in `alanfangblog`
- [x] 4.2 Run Hexo list/doctor checks
- [x] 4.3 Run `hexo clean` and `hexo generate`
- [x] 4.4 Run `openspec validate --all --strict`
- [x] 4.5 Inspect final changed files and confirm no deploy/push was performed

## 5. Publish Preparation

- [x] 5.1 Fetch the GitHub Pages remote state and confirm production has 11 posts
- [x] 5.2 Restore remote-only posts to `source/_posts`
- [x] 5.3 Rebuild and verify the upgraded site still contains 11 posts
- [x] 5.4 Commit and push validated generated output to the GitHub Pages repository
- [x] 5.5 Verify `https://alanfangblog.com/` reflects the updated generated site
