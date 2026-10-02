## Linked issue

<!-- Required: add one of "Closes #12", "Fixes #12" or "Refs #12".
     The CI check fails without it. For a trivial change that genuinely needs
     no issue (typo, formatting), label the PR "no-issue" instead. -->
Closes #

## What

Brief description of the change.

## Why

The problem this solves, and how you validated it.

## Type

- [ ] Design registry (`design/tokens.xml`, `design/themes.xml`)
- [ ] Schema / manifest / determinism rules
- [ ] Tooling (`design/tools/**`)
- [ ] gluestack components (`components/**`)
- [ ] Documentation
- [ ] CI / release process

## Release decision

<!-- A changeset is mandatory for anything touching design/, components/,
     package.json or an entry point. CI refuses the merge without it. -->
- [ ] Changeset added: `npx changeset`
- Bump: `major` / `minor` / `patch` / none (CI/tooling only)

## Design system

- [ ] The change lives in the XML registries, not in generated files
- [ ] `npm run design:gen` re-run, and `config.ts` / `tokens.js` committed
- [ ] A semantic colour was added as a `<role>` in **every** theme
- [ ] No design value added to `tailwind.config.js` (it only wires `tokens.js`)

## Verification

- [ ] `npm run design:pipeline` passes (lint, check, verify, doc)
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `npm run design:gen --check` reports no drift

## Notes

Anything a reviewer should know: trade-offs, follow-ups, migration steps for
consumers upgrading across a major version.