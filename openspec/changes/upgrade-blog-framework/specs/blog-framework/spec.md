## ADDED Requirements

### Requirement: WSL Conda Build Environment
The blog project SHALL provide a reproducible WSL Conda environment named `alanfangblog` that can run the blog's Node.js tooling.

#### Scenario: Environment provides supported Node
- **WHEN** `conda run -n alanfangblog node -v` is executed in WSL
- **THEN** the reported Node.js major version is compatible with the configured Hexo version

### Requirement: Modern Hexo Framework
The blog project SHALL use a maintained Hexo framework and plugin set compatible with the configured Node.js runtime.

#### Scenario: Dependencies install cleanly
- **WHEN** dependencies are installed from `package-lock.json` inside `alanfangblog`
- **THEN** npm completes without dependency resolution failure

#### Scenario: Blog commands are discoverable
- **WHEN** `npm run` is inspected
- **THEN** scripts exist for cleaning, generating, serving, and listing posts

### Requirement: Blog Build Validation
The blog project SHALL generate the static site from source without fatal Hexo errors.

#### Scenario: Posts are listed
- **WHEN** the list-post command is executed inside `alanfangblog`
- **THEN** Hexo lists the source posts without a fatal error

#### Scenario: Site is generated
- **WHEN** the generate command is executed inside `alanfangblog`
- **THEN** Hexo writes the static site to `public/` without a fatal error

### Requirement: Production Publish Safety
The upgrade SHALL publish generated content to GitHub Pages only after preserving production post parity.

#### Scenario: Deployment waits for parity
- **WHEN** the generated site is prepared for publication
- **THEN** the generated archive and home pages include all 11 posts currently present on production

#### Scenario: Deployment uses validated output
- **WHEN** a remote publish operation is performed
- **THEN** the published files come from a successful local `npm run build`

### Requirement: Existing Blog Behavior Preservation
The upgrade SHALL preserve existing source posts, the `alanfangblog.com` CNAME, and the existing permalink structure.

#### Scenario: Source content remains present
- **WHEN** the upgrade is complete
- **THEN** the 9 existing source markdown posts still exist under `source/_posts`

#### Scenario: Remote-only posts are restored
- **WHEN** the upgrade is published
- **THEN** the source includes restored posts for `ASR-wenet-data_preprocess` and `VAD-marblenet`

#### Scenario: Custom domain remains configured
- **WHEN** the generated site is produced
- **THEN** `public/CNAME` contains `alanfangblog.com`
