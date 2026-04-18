# GitHub Workflows

This document describes the structured CI/CD pipeline for Flipova Foundation.

## Pipeline Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     Developer Workflow                            │
│                                                                 │
│  1. Create feature branch                                        │
│  2. Make changes + add changeset                                 │
│  3. Open PR against main                                        │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ PR Checks    │  (labels, size, changeset validation)          │
│  └──────────────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ CI           │  (typecheck, build on Node 20 & 22)           │
│  └──────────────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  Merge to main                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Release Workflow                             │
│                                                                 │
│  Push to main                                                   │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ CI           │  (typecheck, build on Node 20 & 22)           │
│  └──────────────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Release      │  (changesets: version or publish)              │
│  └──────────────┘                                               │
│         │                                                       │
│         ├─► Version PR created (if changesets present)           │
│         │                                                       │
│         └─► Publish triggered (if changesets processed)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     Publish Workflow                              │
│                                                                 │
│  Triggered by Release workflow completion                         │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ npm publish  │  (to GitHub Packages)                        │
│  └──────────────┘                                               │
│         │                                                       │
│         ├─► Docker build (ghcr.io & Docker Hub)                  │
│         │                                                       │
│         ├─► Archive creation (tar.gz)                            │
│         │                                                       │
│         └─► CLI binaries (Linux, macOS, Windows)                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   Documentation Workflow                          │
│                                                                 │
│  Push to main with docs changes                                 │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Build docs   │  (Docusaurus build)                           │
│  └──────────────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  Deploy to GitHub Pages                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Workflows

### CI (`ci.yml`)
- **Triggers**: Push to main, PRs to main
- **Purpose**: Run typecheck and build on Node 20 and 22
- **Concurrency**: Cancels in-progress runs for the same ref

### PR Checks (`pr-checks.yml`)
- **Triggers**: PR events (opened, synchronize, reopened, labeled, unlabeled)
- **Purpose**: Auto-label PRs, check PR size, validate changeset presence
- **Concurrency**: Cancels in-progress runs for the same ref

### Release (`release.yml`)
- **Triggers**: Push to main
- **Purpose**: Handle changesets - create version PR or publish
- **Concurrency**: Does not cancel (important for release process)
- **Behavior**:
  - If changesets present: Creates "Version Packages" PR
  - If no changesets: Skips
  - When version PR merged: Triggers publish workflow

### Publish (`publish.yml`)
- **Triggers**: When Release workflow completes successfully
- **Purpose**: Publish to multiple formats
- **Jobs**:
  1. **npm**: Publish to GitHub Packages
  2. **docker**: Build and push Docker images (depends on npm)
  3. **archive**: Create tar.gz archive (depends on npm)
  4. **cli**: Build CLI binaries for all platforms (depends on npm)
- **Concurrency**: Does not cancel (important for publishing)

### Docs (`docs.yml`)
- **Triggers**: Push to main with docs changes, workflow_dispatch
- **Purpose**: Build and deploy documentation to GitHub Pages
- **Concurrency**: Does not cancel (uses "pages" group)

## Concurrency Handling

All workflows use GitHub Actions concurrency groups to handle multiple pushes:

- **CI & PR Checks**: `cancel-in-progress: true` - Cancels old runs when new push occurs
- **Release & Publish**: `cancel-in-progress: false` - Never cancels (critical for releases)
- **Docs**: Uses dedicated "pages" group

This ensures:
- No wasted CI runs when multiple developers push to the same branch
- Critical release operations are never interrupted
- Documentation deploys are properly sequenced

## Branch Protection

Required settings for main branch:
- Pull request required before merging
- 1 approval required from maintainers
- Status checks required: CI must pass on Node 20 & 22
- Linear history enforced (no merge commits)
- Conversation resolution required

## Secrets Required

- `NPM_PUBLISH_TOKEN`: For publishing to GitHub Packages
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Release Process

1. Developer creates branch and adds changeset
2. PR is opened and validated by CI + PR checks
3. PR is merged to main
4. Release workflow detects changeset and creates version PR
5. Version PR is reviewed and merged
6. Publish workflow runs automatically
7. All release formats are published simultaneously
