---
"@flipova/foundation": patch
---

Make the design tooling satisfy the POSIX executable-bit rule that CI enforces.

`ruff` reports `EXE001` (shebang present but file not executable) on Linux for
the Python entry points, which failed the design gate on every pull request.
The five real entry points are now marked executable in git, and the shebangs
were removed from the `.docgen` modules, which are imported rather than
executed. The `ruff` minimum version is also raised so a Windows developer runs
the same linter as CI.
