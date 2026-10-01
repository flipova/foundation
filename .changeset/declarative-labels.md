---
"@flipova/foundation": patch
---

Declare the labels the automation depends on, and check them in CI.

`.github/labels.yml` is now the source of truth for every label the workflows
use, and `.github/scripts/labels.mjs` acts on it:

  - `--list`   what the repository has today, and what is missing
  - `--check`  read-only verification, wired into PR Checks
  - `--create` creates the missing ones (needs a token, or use the `gh label
    create` commands it prints)

This matters because `actions/labeler` fails outright on an unknown label: a
label deleted by hand would break every pull request with a message that does
not point at the cause. The check now names the missing label and prints the
command to recreate it.

The version decision and the `no-issue` escape hatch are labels too, so they
had to exist to be selectable at all.
