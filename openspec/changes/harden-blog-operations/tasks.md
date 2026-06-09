## 1. Source Baseline

- [x] 1.1 Confirm generated/dependency/deploy directories are ignored
- [x] 1.2 Initialize a local Git repository for the Hexo source tree
- [x] 1.3 Commit the current maintained source state

## 2. Quality Gate

- [x] 2.1 Add a generated-site quality check script
- [x] 2.2 Wire the quality check into package scripts
- [x] 2.3 Validate the check catches source and generated output invariants

## 3. Content Cleanup

- [x] 3.1 Detect Markdown files with recoverable mojibake
- [x] 3.2 Add a guard that rejects suspicious mojibake before build
- [x] 3.3 Rebuild and spot-check representative Chinese articles

## 4. Deployment Hygiene

- [x] 4.1 Confirm the published Pages tree contains no dependency manifests or `node_modules`
- [x] 4.2 Document the source/deploy repository split and release commands
- [x] 4.3 Deploy the verified output from the clean `.deploy_publish` clone

## 5. Verification

- [x] 5.1 Run `npm run build`
- [x] 5.2 Run the quality gate
- [x] 5.3 Run `openspec validate --all --strict`
- [x] 5.4 Verify `https://alanfangblog.com/` and critical article/about pages
