---
"@flipova/foundation": patch
---

Fix the design tooling installation in CI. The workflows resolved
`python-version: '3.x'` to the newest CPython, for which no `lxml < 6` wheel
exists, so pip fell back to building from source and failed on the missing
libxml2/libxslt development headers.

The interpreter is now pinned and the install requires wheels, so the tooling
installs deterministically and a missing wheel fails immediately with a short,
actionable error instead of a long compile failure.
