# How to Contribute

**One command runs the whole cycle.**

```bash
npm run flow
```

It walks, in order: the issue, the release decision, the branch, the checks, the
commit, the push, the pull request, and the link back to the issue. It skips
whatever is already done, so running it before and after your changes is the
expected way to work.

You make four decisions. Everything else is generated:

| You decide | Flow asks for |
| --- | --- |
| what the issue is | a title and a template (`feature`, `bug`, `chore`, blank) |
| whether this is a release | `major`, `minor`, `patch`, or `none` |
| what the change says | one line, which becomes the changelog entry |
| the commit subject | one line |

The `Issues:` trailer, the `Closes #n` line, the branch, the version file and the
labels are all derived, never typed.

## Designing in this repository

The registries are the single source of truth. Change the XML, and the generated
files follow.

```
design/
|-- manifest.xml        pipeline config + determinism rules
|-- schema.xsd          the contract the linter validates
|-- tokens.xml          tokens: spacing, colours, typography, shadows, motion
|-- themes.xml          theme role maps (light, dark)
|-- documentation.xml   this page's own source
|-- canonical.index.txt generated index of every entry
|-- tools/              Python toolchain (linter, checker, generate, docgen, xmleditor)

components/ui/gluestack-ui-provider/
|-- config.ts           GENERATED: colour variables, light and dark
|-- tokens.js           GENERATED: the whole Tailwind theme

docs/generated/         GENERATED: this site
tailwind.config.js      only wires `extend: tokens.theme` - never a design value
```

Where a change goes:

| You want to change | Edit |
| --- | --- |
| a palette value, a scale | `design/tokens.xml` |
| a semantic colour, a role | `design/themes.xml` |
| a determinism rule | `<determinism>` in `design/manifest.xml` |
| a documentation page | the `<article><content>` in `design/documentation.xml` |

Four rules the tooling cannot check for you:

1. **Add a semantic colour to every theme** in `design/themes.xml`. A role that
   exists in only one theme renders as a missing role in the other.
2. **Never add a design value to `tailwind.config.js`.** Colours, scales, font
   families, shadows and z-index belong in the registries.
3. **Never hand-edit a generated file** (`config.ts`, `tokens.js`,
   `docs/generated/**`). The next run overwrites it.
4. **Commit the sources and the regenerated output together**, or `flow verify`
   fails on drift.

### A theming change, in one line

Add or edit a `<role>` in `design/themes.xml` whose `id` is the gluestack CSS
variable name without the `--` prefix, point it at a token, then
`npm run design:gen`. `tokens.js` - and therefore every Tailwind utility -
follows on its own.

## The gate

```bash
npm run flow verify
```

Runs, in order: the changeset against its declaration, the generated files
against the registries, the registry validation, and the types. It is a gate and
not a formatter: nothing is rewritten, so a failure always means "look at this".

For the full regeneration, `npm run design:pipeline` (`gen`, `check`, `verify`,
`lint`, `doc`). If you touched a registry, `npm run design:canonical` and commit
`design/canonical.index.txt`.

## Versioning

There is exactly **one** version in this repository: the root `package.json`,
the one that actually gets published. The registries store no copy of it:

- `npm run version:bump` (= `changeset version` **+** `flow release reset` **+**
  `npm run design:doc`) bumps `package.json`, returns the release declaration to
  `none`, and regenerates the documentation in one step. The release workflow
  uses that command, so the version pull request can never be inconsistent.
- `design/manifest.xml` has **no** `<version>` element: the XSD would reject it,
  so a second copy cannot be reintroduced by accident.

There is exactly one changeset too, `.changeset/release.md`, generated from
`.github/flow/release.yml`. Declare the bump with `npm run flow -- release`;
never edit the generated file and never add a second one.

### The release path

```
branch
   |
   v  pull request  (CI: typecheck, design gate, changeset required, flow state in sync)
main
   |
   v  changesets opens/updates the "chore: version packages" pull request
"chore: version packages"  <-- the only path that publishes
   |
   v  merging it runs the release preflight, then publishes
npm
```

The preflight refuses to publish unless a changesets commit produced the version
currently in `package.json`, so a release cannot happen by accident. A `hotfix`
dispatch with a mandatory reason is the only exception, and the quality gates
still run.
