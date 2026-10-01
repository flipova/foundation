---
"@flipova/foundation": patch
---

Stop the version pull request from failing its own checks. The
`chore: version packages` pull request opened by changesets carries no changeset
by construction: changesets consumes the pending ones and its own release
decision is the version bump it contains. Requiring a changeset on it made the
gate fail with "Some packages have been changed but no changesets were found",
which blocked the very pull request that publishes a release.

The three gates now recognise a changesets release pull request - by its
`changeset-release/` branch or its reserved title - and step aside: the CI
changeset requirement, `changeset-guard.yml`, and the issue-linkage rule in
`pr-lifecycle.yml`. Every other pull request is unaffected.
