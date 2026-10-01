---
"@flipova/foundation": patch
---

Set up proper project hygiene on GitHub so every change is traceable from an
issue to a changelog entry.

- Issue forms (bug report, feature request) replace the templates that still
  described the removed layout/block/studio architecture. They ask for the
  version and the affected layer - for this repository, the registry entry
  involved - which is what makes a design-system report actionable.
- The pull request template requires a linked issue (`Closes #n`), a declared
  release decision, and the design-system checks (change lives in the XML
  registries, generated files regenerated, roles added to every theme, no design
  value in `tailwind.config.js`).
- The labeler is repointed at the current structure. It referenced the deleted
  `foundation/` tree, so it had stopped labelling anything; it now maps
  `registry`, `tokens`, `theme`, `components`, `config`, `ci` and `docs`.
- Blank issues are disabled, and questions are routed to Discussions.
- The soft `changeset status` check is removed from `pr-checks.yml`: the hard
  gate already lives in the `Design registry` CI job, which scopes it to the
  published surface.
