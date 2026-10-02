---
"@flipova/foundation": patch
---

Make the version decision impossible to forget, and document the collaboration
process end to end.

`changeset-guard.yml` closes the "I forgot the changeset" dead end. When a pull
request changes the published surface without a changeset, labelling it
`changeset:major`, `changeset:minor`, `changeset:patch` or `changeset:none` makes
the workflow write the changeset, commit it to the branch, push it and explain
itself in a comment. `changeset:none` produces an empty changeset for a real
change that needs no release. Without a label the check fails and names the
labels to apply. The workflow only runs git plumbing and GitHub API calls, never
the pull request's code, which is what makes its write token safe.

The CI gate now resolves the comparison point from the pull request base sha
instead of a branch name, so it no longer depends on a remote-tracking ref
having been fetched.

CONTRIBUTING now covers the whole process: the label-driven version decision, the
stacked-branch workflow, the exact checks to mark as required, and a
troubleshooting section for the four failure modes that actually occur here
(missing changeset, `lxml` source build, POSIX-only `EXE001`, and the registry
`E404` on publish).
