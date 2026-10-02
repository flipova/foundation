# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to
decide the next version and write `CHANGELOG.md`.

## There is exactly one changeset, and it is generated

`.changeset/release.md` is the **only** file in this directory that changesets
reads, and it is generated. Do not edit it, and do not add a second one.

The declaration lives in `.github/flow/release.yml`:

```yaml
bump: patch          # major | minor | patch | none
summary: |-
  ...
```

```bash
npm run flow -- release          # choose the bump, write the summary
npm run flow -- release sync     # regenerate release.md from the declaration
npm run flow -- release check    # drift between the two (run by CI)
npm run flow -- release consolidate
```

`release check` fails when `release.md` and the declaration disagree, or when a
second changeset file appears here. Both are mistakes that used to be caught by
`changeset version` at release time, as an error naming neither the file nor the
line.

`release consolidate` folds every changeset file written by an older version of
the tooling into the single declaration, keeping the highest bump. It reports the
files it cannot read and changes nothing, so a malformed changeset is named
instead of stopping a release.

## How a version reaches the registry

1. Merging a pull request into `main` runs the release workflow.
2. `changeset version` consumes `.changeset/release.md`, bumps `package.json`,
   `docs/package.json` and the site version, and writes `CHANGELOG.md`.
3. That is the `chore: version packages` pull request. Merging it publishes.
4. The version pull request carries no changeset: it is the output of
   `changeset version`, and the guard knows it by subject.

A `bump: none` declaration produces no changeset file at all, which is the
correct state for a cycle with nothing to release.

