---'@flipova/foundation': patch---

Declare the tracker in the repository: `.github/issues/*.yml` holds one issue per
file, and `.github/scripts/issues.mjs` syncs it to GitHub, verifies it in CI, and
resolves local ids into a real `Closes #n` on the pull request. `--link` refuses
to reference a pull request, because GitHub shares one numbering between issues
and pull requests.