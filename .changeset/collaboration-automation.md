---
"@flipova/foundation": patch
---

Automate the collaboration flow so issues and pull requests stay resolvable when
several people work in parallel.

- `pr-lifecycle.yml` refuses a pull request that references no issue or that
  conflicts with its base, merges the base into branches that fall behind (only
  when the merge is clean and the branch is not a fork), keeps a single
  up-to-date status comment instead of spamming, and enables squash auto-merge
  once everything is green. The job is serialised per pull request so two
  updates cannot race on the same branch.
- `issue-lifecycle.yml` triages new issues (labels, duplicate detection,
  guidance), records how a closed issue was resolved, and ages out unattended
  threads. Each automation keeps one comment per thread and updates it in place.
- Both workflows check out the repository rather than the pull request code, so
  granting them write access stays safe.
