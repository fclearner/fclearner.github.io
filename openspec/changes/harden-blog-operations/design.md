# Design

## Source Versioning
Initialize Git in `E:\workspace\github\MyBlog\blog` and commit the source tree after generated directories are ignored. The source repository remains local because no source remote name/owner has been provided.

## Quality Gate
Add a Node-based script that reads the generated `public/` tree and verifies:
- exactly 11 source posts and 11 archive posts;
- generated `CNAME` is `alanfangblog.com`;
- generated HTML does not contain stale `http://yoursite.com`;
- local links and local image/script/style assets resolve inside `public/`;
- known critical pages and images exist, including the About image.

The script runs after `npm run build` so it validates the real generated output.

## Encoding Repair
Use a narrow UTF-8-as-GBK mojibake repair pass on Markdown files that contain known garbled markers. Keep a backup-free mechanical edit because Git will hold the before/after state once initialized.

## Deployment
Continue using the clean `.deploy_publish` clone for GitHub Pages output. This avoids the stale sibling `fclearner.github.io` working tree and keeps source and generated output separate.
