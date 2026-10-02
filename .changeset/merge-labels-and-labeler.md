---
"@flipova/foundation": patch
---

Merge the labels and the labeler into one source of truth. `.github/labels.yml`
now declares each label with its colour, its description and the `paths` that
trigger it; `.github/labeler.yml` is generated from that and checked for drift by
CI.

This removes the two failure modes of keeping them apart: a hand-written labeler
referencing a label that does not exist - `actions/labeler` fails outright on
an unknown label - and labelling rules that silently stop matching. It also
means adding a label is one edit instead of two.

CONTRIBUTING now states precisely where the issue reference goes: the workflow
reads the pull request description, not the title, not a commit message and not
a bot comment.