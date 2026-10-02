# Contributing

**One command runs the whole cycle.**

```bash
npm run flow
```

In a terminal it opens a dashboard - branch, issue, release, npm, working tree,
pull request - and an **arrow-key menu**: run the whole cycle, or take one step
at a time (`↑`/`↓` to move, `Enter` to choose, `q` to leave).

Pick "run the cycle" and it walks, in order: the issue, the release decision,
the branch, the checks, the commit, the push, the pull request, and the link
back to the issue. It skips whatever is already done, so running it twice is
safe and running it after you have made your changes is the expected way to use
it. With no terminal there is no menu - the cycle simply runs, which is what
keeps `npm run flow` usable in a pipe and in CI.

You make four decisions. Everything else is the tool's problem.

| You decide | Flow asks you for |
| --- | --- |
| what the issue is | a title, and a template (`feature`, `bug`, `chore`, or blank) |
| whether this is a release, and which bump | `major`, `minor`, `patch`, or `none` |
| what the change says | one line, which becomes the changelog entry |
| the commit subject | one line |

The `Issues:` trailer, the `Closes #n` line, the branch, the version file, the
labels - all generated, never typed.

## The eight steps

| # | Step | What happens |
| --- | --- | --- |
| 1 | `issue` | declares `.github/issues/<id>.yml` locally, from a template or blank. Or `link` adopts an issue that already exists on GitHub. |
| 2 | `release` | you pick the bump and the summary; flow writes `.github/flow/release.yml` and generates `.changeset/release.md` from it |
| 3 | `branch` | creates and switches to a branch off `main` |
| 4 | `verify` | changeset drift, generated files against the registries, registry validation, types |
| 5 | `commit` | `git add -A`, then a commit whose subject you give and whose `Issues:` trailer flow derives |
| 6 | `push` | pushes and sets the upstream |
| 7 | `pr` | opens the pull request with the linked issues and the changelog entry as its body |
| 8 | `link` | writes `Closes #n` into the pull request description, resolving the numbers for you |

Steps 1 to 3 happen before you write code. Do the work. Run `npm run flow` again:
it picks up at step 4, because the first three are already recorded for the
branch.

```bash
npm run flow            # the menu; with no terminal, the cycle in order
npm run flow status     # where am I: branch, issue, release, npm, working tree, PR
npm run flow verify     # just the checks
```

## From a merge to npm

Two merges, two runs of the Release workflow, one publish:

```text
declare it            merge the work           merge "chore: version packages"
flow release     ->   into main            ->  into main
.changeset/           Release run #1           Release run #2  ->  npm publish
release.md            declares the bump        gate: "## <version>" is in CHANGELOG.md
                      opens the version PR
```

Nothing publishes from an ordinary commit, and a run that decides *not* to
publish still ends green. Which of those places the chain is at is one command:

```bash
npm run flow -- release status
```

It reads the declaration, the pending changesets, what npm actually holds, and
the last three Release runs - and ends with one line saying what happens next.
`.github/RELEASING.md` is the full runbook: authentication, the gate, and what
to do when a publish fails.

## When the issue already exists

If the work was already tracked in the browser, adopt it rather than declaring a
duplicate:

```bash
npm run flow -- issue link 42
```

flow mirrors the title, the labels and the body into `.github/issues/<id>.yml` and
records the number, so the entry becomes reviewable like any other source file.

## Everything flow handles for you

You do not need to know any of this to work on the repository. It is here so that
a surprising message is recognisable.

- **The changeset.** There is exactly one, `.changeset/release.md`, and it is
  generated from `.github/flow/release.yml`. Never edit the first, never add a
  second. `flow release consolidate` folds changesets written by older tooling
  into the single declaration.
- **Issue numbering.** GitHub shares one numbering between issues and pull
  requests, so `Closes #12` where 12 is a pull request closes nothing. flow
  resolves the local ids to real issue numbers and refuses to point at a pull
  request.
- **The pull request body.** `Closes #n` goes in the description, on its own
  line - that is where `pr-lifecycle.yml` reads it, not the title and not a
  comment.
- **Labels.** `.github/labels.yml` is the single source of truth: name, colour,
  description and the paths that trigger it. `.github/labeler.yml` is generated
  from it and checked for drift. Edit the first, never the second.
- **The version PR.** Merging into `main` opens `chore: version packages`;
  merging *that* publishes. Nothing publishes from an ordinary commit.
- **Generated files.** Never hand-edit them. `flow verify` fails if they drift
  from the registries.

## The token

Anything that talks to GitHub needs one:

```bash
GITHUB_TOKEN=<a fine-grained PAT: issues:write, pull-requests:write> npm run flow
```

`GH_TOKEN` works too. In Actions, `secrets.GITHUB_TOKEN` is injected for you.

## Scripting it

Every step takes flags, so the menu is a front end over the same functions
rather than a second code path - and with no terminal each prompt falls back to
its documented default instead of blocking.

```bash
npm run flow -- issue new --template bug --title "..." --summary "..."
npm run flow -- release --bump patch --summary "..."
npm run flow -- commit --subject "fix(ci): ..." --body-file msg.txt
npm run flow -- branch --name fix/the-thing
npm run flow -- pr --title "..." && npm run flow -- link
```

## Commit messages

`type(scope): description`. The type tells a reader what kind of change this is,
and it usually matches the bump you chose.

| Type | Bump | Use when |
| --- | --- | --- |
| `feat` | `minor` | new capability |
| `feat!` | `major` | breaking change to the public API |
| `fix` | `patch` | bug fix |
| `docs` | `none` | documentation |
| `refactor` | `none` | restructuring, no behaviour change |
| `chore` | `none` | tooling and maintenance |

## Working in this repository

The registries are the source of truth. The generated files are an output, never
an input.

```
design/
|-- manifest.xml        pipeline config + determinism rules
|-- schema.xsd          the contract the linter validates
|-- tokens.xml          tokens: spacing, colours, typography, shadows, motion
|-- themes.xml          theme role maps (light, dark)
|-- documentation.xml   the documentation source
|-- canonical.index.txt generated index of every entry
|-- tools/              Python toolchain (linter, checker, generate, docgen, xmleditor)

components/ui/gluestack-ui-provider/
|-- config.ts           GENERATED: colour variables, light and dark
|-- tokens.js           GENERATED: the whole Tailwind theme

docs/generated/         GENERATED: the documentation site content
tailwind.config.js      only wires `extend: tokens.theme` - never a design value
```

**A theming change, in one line:** add or edit a `<role>` in `design/themes.xml`
whose `id` is the gluestack CSS variable name without the `--` prefix, point it at
a token, then `npm run design:gen`. `tokens.js` - and therefore every Tailwind
utility - follows on its own.

Three rules that the tooling cannot check for you:

1. **Add a semantic colour to every theme** in `design/themes.xml`. A role that
   exists in only one theme renders as a missing role in the other.
2. **Never put a design value in `tailwind.config.js`.** Colours, scales, font
   families, shadows and z-index belong in `design/tokens.xml` /
   `design/themes.xml`.
3. **Commit the sources and the regenerated output together**, or `flow verify`
   fails on drift.

## When something goes wrong

**`No commit in the history wrote "version": ...`**
The release preflight could not find the changesets commit that produced the
version in `package.json`. Merge the `chore: version packages` pull request, or
dispatch the release workflow with `hotfix = true` and a reason.

**`Some packages have been changed but no changesets were found`**
A pull request touches the published surface without a release decision. Run
`npm run flow -- release`. If the change really needs no release, `none` satisfies
the gate. Two cases are **not** your mistake: the bot-managed
`chore: version packages` pull request (it consumes changesets by design), and a
pull request whose changeset was already consumed by an earlier version bump.

**`.changeset/release.md: missing`**
`changeset version` consumed the changeset and the declaration was not reset. Run
`npm run flow -- release reset` - and if you produced that version yourself, run
`npm run version:bump`, which resets it for you.

**`EXE001: Shebang is present but file is not executable`**
`ruff` applies this rule only on POSIX, so it appears in CI and never on a
Windows checkout. The five real entry points (`checker.py`, `docgen.py`,
`generate.py`, `linter.py`, `xmleditor.py`) are executable in git; any other
module must not carry a shebang, because it is imported rather than executed.

**`lxml` fails to build**
The workflows pin Python 3.12 and install with `--only-binary=:all:`. Keep that
pin when touching them, and never widen `lxml` past 6 without checking a wheel
exists for the pinned interpreter.

**Publishing fails with `EOTP`: "This operation requires a one-time password"**
The token is valid - npm authenticated it - but it is a **classic** token, and
the account has 2FA on "authorization and writes", so npm will only publish
interactively. No npm command reveals this before publishing, which is why the
preflight can pass and the publish still fail.

Create an **automation** token (npmjs.com → Access Tokens → Generate New Token →
**Automation**, scoped to publish on `@flipova`) and replace the
`NPM_PUBLISH_TOKEN` secret. An automation token bypasses 2FA, so no OTP is ever
requested.

**Publishing fails with `E404 Not Found`**
The package exists, so npm is hiding a permission failure: no write access to the
scope, or a token from another registry (a GitHub Packages token fails exactly
like this).

Both of these, and `E401`, `E403` and `E409`, are now translated by
`release:ci` into the action that fixes them, so a failed publish no longer
ends in a wall of npm output.

## How the release authenticates

Two modes, chosen by whether the `NPM_PUBLISH_TOKEN` secret exists. No
configuration change is needed to move between them.

| | `oidc` — trusted publishing | `token` — the secret |
| --- | --- | --- |
| selected when | no `NPM_PUBLISH_TOKEN` secret | the secret is set |
| credential | GitHub signs an OIDC token, npm exchanges it for a short-lived one | a long-lived npm token |
| `npm whoami` / `npm access` in the preflight | skipped — npm says they are not a check | run |
| npm CLI on the runner | upgraded to `latest` | as shipped with Node |

To switch to trusted publishing:

```bash
npm install -g npm@latest
npm login                                     # interactive; 2FA is required

npm trust list @flipova/foundation
npm trust github @flipova/foundation \
  --file release.yml \
  --repository flipova/foundation \
  --allow-publish
```

`--file` is the workflow filename only, not a path: it must match the workflow
that actually contains the publish, which here is `.github/workflows/release.yml`.
`--repository` is `owner/repo`. `--environment` is only needed if you use a
GitHub environment.

To remove it again:

```bash
npm trust list @flipova/foundation        # gives the id
npm trust revoke @flipova/foundation --id <id>
```

Then **delete the `NPM_PUBLISH_TOKEN` secret** — its absence is what selects the
mode. Keep it a moment if you prefer: leaving it in place only means the token
path is still taken.

npm requires npm **11.5.1+**, Node **22.14+**, and 2FA enabled on your account.
`npm trust` is interactive by design: it rejects bypass-2FA tokens, because
creating a trusted publisher is an account-governance action, and legacy
username/password credentials do not work either. `npm login` is the way in.

`id-token: write` is what makes it work; without it GitHub issues no OIDC token,
and the workflow says so by name before publishing.

The whole procedure - `npm trust`, the flags, the switch, the pending versions,
and a table of publish errors - is in [`.github/RELEASING.md`](.github/RELEASING.md).

## What has accumulated

`flow` moves a cycle forward and never looks back: it declares the issue, cuts
the branch, commits, pushes, opens the pull request, and finally deletes the
branches whose work reached `main`. Everything the cycle leaves *around* itself
is nobody's job. `maintain` is that job.

```bash
node .github/scripts/maintain.mjs list
```

Four sections, all read-only: `state` (the records this clone holds - the
scratch file, `.numbers.json`, strays in `.git`), `issues` (the registry against
the tracker), `prs`, and `branches`. Every finding is one of three things:

- **`+`** nothing is wrong. The line exists so a clean run is visible.
- **`!`** an accumulation `maintain fix` repairs on its own: a scratch file
  describing a branch that no longer exists, a commit message git has already
  read, an open issue that is an exact duplicate of a declared one.
- **`-`** something a person has to decide about, which `fix` never touches: an
  open issue nothing declares, a merged branch left on the remote, a number
  whose file is gone.

Two boundaries worth knowing:

- **Records, not refs.** `maintain` never deletes a branch. Which branches may
  go is `flow clean`'s policy, and re-deriving that policy here is how two
  commands end up disagreeing about what is safe to delete. The `branches`
  section reports and points; `flow clean` acts.
- **It degrades honestly.** Without `GITHUB_TOKEN`/`GH_TOKEN` the GitHub
  sections say they were not read rather than pretending to be complete, and
  `fix` still tidies the clone while listing what it skipped. `fix` exits
  non-zero when it found something it could not repair.

```bash
node .github/scripts/maintain.mjs fix          # asks first
node .github/scripts/maintain.mjs fix --yes    # does not
node .github/scripts/maintain.mjs issues --json
```

It runs outside the cycle on purpose: nothing in `package.json` points at it, so
adding it cannot move the release or trip the changeset guard.

## Command reference

| Command | Does |
| --- | --- |
| `npm run flow` | the menu: a dashboard, then the cycle one step at a time |
| `npm run flow status` | branch, issue, release, npm, working tree, pull request |
| `npm run flow verify` | changeset, generated files, registries, types |
| `npm run flow -- issue list` | the registry and its GitHub numbers |
| `npm run flow -- issue new` | declare an issue locally |
| `npm run flow -- issue link <n>` | adopt an existing GitHub issue |
| `npm run flow -- issue sync` | create/update the declared issues on GitHub |
| `npm run flow -- issue check` | read-only verification (run by CI) |
| `npm run flow -- release` | declare the bump and the summary |
| `npm run flow -- release sync` | regenerate `.changeset/release.md` |
| `npm run flow -- release reset` | end the cycle (also run by `version:bump`) |
| `npm run flow -- release consolidate` | fold old changesets into the single one |
| `npm run flow -- release check` | drift between the declaration and the changeset (CI) |
| `npm run flow -- release status` | does npm have this version? what did Release decide? |
| `npm run flow -- branch [name]` | create and switch |
| `npm run flow -- commit` | commit with the `Issues:` trailer |
| `npm run flow -- push` | push and set the upstream |
| `npm run flow -- pr [title]` | open the pull request |
| `npm run flow -- link [pr]` | write `Closes #n` into the pull request |
| `node .github/scripts/maintain.mjs list` | what has accumulated, read-only |
| `node .github/scripts/maintain.mjs fix` | apply the repairs `list` found |

Labels are managed separately, because they are maintenance rather than part of
a cycle:

```bash
node .github/scripts/labels.mjs --list
node .github/scripts/labels.mjs --check
node .github/scripts/labels.mjs --sync-labeler
GITHUB_TOKEN=<pat> node .github/scripts/labels.mjs --create
```
