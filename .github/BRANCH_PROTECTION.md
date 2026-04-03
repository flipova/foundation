# Branch Protection Setup

Configure these rules on GitHub at Settings → Branches → Add rule for `main`:

## Required settings

- **Require a pull request before merging**: ON
  - Required approvals: 1
  - Dismiss stale reviews: ON
  - Require review from code owners: ON (once CODEOWNERS is set up)
- **Require status checks to pass**: ON
  - Required checks: `check (20)`, `check (22)`
- **Require conversation resolution**: ON
- **Require linear history**: ON (enforces squash or rebase, no merge commits)
- **Do not allow bypassing the above settings**: ON (even for admins)

## Recommended settings

- **Restrict who can push**: Only the release bot and maintainers
- **Allow force pushes**: OFF
- **Allow deletions**: OFF
