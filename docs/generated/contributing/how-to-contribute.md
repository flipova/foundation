# How to Contribute

## The channels

Work lands on `dev`, and travels the release ladder one branch at a time. Each
channel accepts only the one before it:

```
dev  ->  alpha  ->  beta  ->  rc  ->  main  ->  tag vX.Y.Z
```

`main` is production. For this repository the deliverable is the npm package, so
`main` publishes; in another repository it would be a site, an image, anything.

1. Branch off `dev` and open a pull request into `dev`: squash is the only merge
   allowed for work branches, and one review is required.
2. Promote from the **workspace**, not from this repository. `corral` walks the
   ladder, waits for the checks, and never cuts a delivery short:

```bash
corral promote v2.4.2-alpha.1 --repo foundation --merge   # dev   -> alpha, tag
corral promote v2.4.2-beta.1  --repo foundation --merge   # alpha -> beta,  tag
corral promote v2.4.2-rc.1    --repo foundation --merge   # beta  -> rc,    tag
corral promote v2.4.2         --repo foundation --merge   # rc    -> main,  tag
```

The tag is what publishes. `.github/workflows/release.yml` refuses a tag that
does not match the version in `package.json`, runs `npm run deploy`, and opens
the GitHub release with the notes GitHub generates for it.

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
4. **Commit the sources and the regenerated output together**, or
   `npm run design:gen:check` (run by CI) fails on drift.

### A theming change, in one line

Add or edit a `<role>` in `design/themes.xml` whose `id` is the gluestack CSS
variable name without the `--` prefix, point it at a token, then
`npm run design:gen`. `tokens.js` - and therefore every Tailwind utility -
follows on its own.

## The gate

```bash
npm run design:pipeline     # gen, check, verify, lint, doc
npm run typecheck
npm test
```

CI runs all of it on every pull request, plus `npm run format:check` and the
build: `.github/workflows/dev.yml` on `dev`, `staging.yml` for a pull request
into `staging`, and `release.yml` on the release channels and `main`. The design
gate is not a formatter — nothing is rewritten, so a failure always means "look
at this".

If you touched a registry, run `npm run design:canonical` and commit
`design/canonical.index.txt`.

## Versioning

There is exactly **one** version in this repository: the root `package.json`,
the one that actually gets published. The registries store no copy of it:
`design/manifest.xml` has **no** `<version>` element, the XSD would reject it, so
a second copy cannot be reintroduced by accident. `corral promote` writes that
one version, and the release workflow refuses a tag that disagrees with it.

### The release path

```
branch
   |
   v  pull request into dev   (CI: lint, format, typecheck, tests, build, design gate)
dev
   |
   v  promote                 (each merge waits for the checks to be green)
alpha
   |
   v  promote
beta
   |
   v  promote
rc
   |
   v  promote
main
   |
   v  tag vX.Y.Z              (the tag must match package.json)
npm
```

Nothing publishes from an ordinary commit: only a `v*` tag on `main` reaches the
registry, through the trusted publisher (OIDC) declared on npm, so there is no
token to rotate and no secret to leak.
