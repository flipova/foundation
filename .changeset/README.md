# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

## How to add a changeset

When you make a change that should be released, run:

```bash
npx changeset
```

This will prompt you to:
1. Select the package(s) affected
2. Choose the semver bump type (patch/minor/major)
3. Write a summary of the change

The changeset file is committed with your PR. When the PR is merged, the release workflow will:
1. Collect all changesets
2. Open a "Version Packages" PR that bumps versions and updates CHANGELOG.md
3. When that PR is merged, it publishes to GitHub Packages
