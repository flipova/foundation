---
"@flipova/foundation": patch
---

Make the issue-linkage failure actionable. The error named a placeholder issue
number and did not say which pull request it was about, which made it easy to
mistake for a false positive. It now names the pull request, explains the two
ways out (link an issue, or label the pull request `no-issue` for a trivial
change), and the status comment reflects the same choice.
