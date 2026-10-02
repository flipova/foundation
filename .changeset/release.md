---
'@flipova/foundation': patch
---

Make the contribution flow enforceable rather than advisory, and give the
repository one entry point for the whole cycle: issue, changeset, branch,
commit, pull request.

### A single changeset, declared once

`.github/flow/release.yml` declares the bump and the summary for the cycle,
and `.changeset/release.md` is generated from it. `.changeset/` holds exactly
one file, and `flow release check` reports any drift between the declaration
and what `changeset version` actually reads. The version decision is one
reviewable file instead of a dozen that individually mean very little.

A changeset with malformed frontmatter used to stop the whole release with an
error naming neither the file nor the line. `flow release consolidate` folds
every existing changeset into the single one, and names the files it cannot
read instead of failing later.

### The cycle, end to end

`node .github/scripts/flow.mjs` walks the cycle in order and skips whatever is
already done: declare or adopt an issue, declare the release, branch, commit
with the `Issues:` trailer, push, open the pull request, link the issue. Every
step is also usable on its own, and a non-interactive run falls back to the
documented defaults instead of blocking on a prompt.

### Issues declared in the repository

`.github/issues/<id>.yml` declares one issue per file - id, title, labels,
body - and syncs it to GitHub, so a tracker entry is reviewable like any other
source file. `flow issue link <n>` adopts an issue that already exists on the
tracker. `flow link` resolves the local ids and writes `Closes #n` into the
pull request, refusing to reference a pull request, because GitHub shares one
numbering between issues and pull requests.

### Labels

`.github/labels.yml` declares every automation label with its colour, its
description and the paths that trigger it; `.github/labeler.yml` is generated
from it and checked for drift. The five labels left over from the removed
architecture (`blocks`, `hooks`, `layout`, `primitives`, `studio`) are gone.

### Release path

`package.json` is the single source of the version. The release workflow
refuses anything unexpected, authenticates against the registry before
uploading, and names the likely cause of a failure - missing, expired,
classic, or wrong-registry token - instead of failing with a bare `E404`. A
`hotfix` dispatch with a mandatory reason is the only way to skip the version
pull request.

### CI

- the issue-linkage failure now names the pull request and the two ways out:
  link an issue, or label the pull request `no-issue`;
- labelling a pull request `changeset:major|minor|patch|none` makes the guard
  write the changeset, commit it to the branch and explain itself;
- the design registry gate runs on every pull request and on `main`;
- line endings are normalised (`.gitattributes`), so a generated file can no
  longer look out of date only on Windows.
