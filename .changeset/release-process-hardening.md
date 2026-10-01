---
"@flipova/foundation": patch
---

Harden the release process so a version and its publish always go through the
expected path, and fail early with an actionable message instead of a bare
`E404 Not Found` from the registry.

- `package.json` is now the single source of the version: the design registries
  store no copy of it, so `changeset version` can no longer leave the pipeline
  describing a different version than the one being published.
- The release workflow decides the path before touching the registry and refuses
  anything unexpected: a commit on `main` that is neither a pending changeset nor
  the `chore: version packages` commit cannot publish, and a version already
  present on the registry is not re-published.
- The preflight authenticates against the registry and checks write access on
  the package, naming the likely cause (missing, expired, classic, or
  wrong-registry token) when it fails.
- A `hotfix` dispatch with a mandatory `reason` is the only way to skip the
  version pull request; the quality gates still run.
- CI now runs a design registry gate on every pull request and on every push to
  `main`, and requires a changeset for any change to the published surface.
