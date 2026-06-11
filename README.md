# AlanFangBlog

Hexo source for `alanfangblog.com`.

## WSL Environment

Use the project Conda environment from WSL:

```bash
conda activate alanfangblog
cd /mnt/e/workspace/github/MyBlog/blog
npm install
npm run theme:link
```

The environment is pinned to Node.js 22, which satisfies the Hexo 8 runtime requirement.

## Common Commands

```bash
npm run check:encoding
npm run list:posts
npm run doctor
npm run build
npm run check:site
npm run verify
npm run serve
```

## Search And Comments

Search is static and does not need a database or service. The Hexo build
generates `public/search.xml` with `hexo-generator-searchdb`, and NexT performs
the search in the browser.

Comments are different because static hosting cannot store visitor input by
itself. This blog uses `utterances`, which stores comments in GitHub Issues for
`fclearner/fclearner.github.io`; no custom database or backend service is
required.

Provider options considered:

- `utterances`: stores comments in GitHub Issues; no custom database or server,
  but the Utterances GitHub App must be installed for the target repository.
- `giscus`: stores comments in GitHub Discussions; no custom database or server,
  but Discussions and the Giscus app/config are required. The current NexT
  package has built-in Utterances support; Giscus would need custom injection.
- `isso` or `remark42`: fully self-hosted; requires running a service and
  maintaining its storage/database.

For comments to accept new input on the live site, the Utterances GitHub App
must be installed for `fclearner/fclearner.github.io`, and Issues must be
enabled on that repository.

## Source And Deploy Repositories

This directory is the maintained Hexo source project. Generated output is ignored by Git:

- `node_modules/`
- `public/`
- `.deploy_git/`
- `.deploy_publish/`
- `themes/*`

The published GitHub Pages repository is `fclearner/fclearner.github.io`. Use the clean local clone at `.deploy_publish` for generated output. The sibling `E:\workspace\github\MyBlog\fclearner.github.io` is an older working tree and should not be used for publishing.

## Publish Flow

The source tree currently contains 17 posts: 7 retained posts after pruning empty and placeholder content, plus the PVAD technical article and 9 focused open-source AI engineering series articles. Before publishing, run:

```bash
npm run verify
```

To validate, sync generated output, and create a Pages commit:

```bash
npm run deploy:pages -- "Site updated: YYYY-MM-DD short reason"
```

This WSL environment currently does not have GitHub push credentials. Push the generated Pages commit with Windows Git:

```powershell
git -C E:\workspace\github\MyBlog\blog\.deploy_publish push origin master
```

If WSL GitHub credentials are configured later, `npm run deploy:pages:push -- "message"` can commit and push in one step.

## Remote Source Hosting

This source project is pushed to the `source` branch of `fclearner/fclearner.github.io`. The `master` branch remains the GitHub Pages static output branch.

Do not merge `source` into `master`. To update the source remote:

```bash
git push origin source
```

The included GitHub Actions workflow verifies source pushes. A future improvement can move the Pages publish step into CI after repository secrets and branch protection are configured.
