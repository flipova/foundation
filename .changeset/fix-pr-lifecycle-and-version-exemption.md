---
"@flipova/foundation": patch
---

Fix two defects reported by the pull request lifecycle workflow.

- `github.rest.checks.listCheckSuitesForRef` does not exist: the Octokit method
  is `listSuitesForRef`. The status comment and the auto-merge step crashed on
  every pull request because of it.
- The issue-linkage rule rejected the changesets release pull request. That
  pull request is bot-managed and carries no issue reference, so the rule now
  exempts it. Recognition no longer relies on a naming convention alone: a
  pull request is treated as a release pull request when it is on a
  `changeset-release/` branch or has the reserved title, and also when it
  consumes changesets (deletes them, adds none) while bumping the version.
  Both signals were verified against a real `changeset version` run.
