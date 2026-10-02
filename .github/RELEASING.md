# Publishing to npm

This is the runbook for getting a version onto npm. It is written for a human
doing it once, not for the workflow - the workflow is documented in its own
header, and the everyday contribution process is in `CONTRIBUTING.md`.

Current state: **main is 2.0.2, npm has 1.14.0.** Nothing in the 2.x line has
been published yet.

## The two modes

The release workflow picks its authentication from one thing: whether the
`NPM_PUBLISH_TOKEN` repository secret exists.

| | `oidc` - trusted publishing | `token` - the secret |
| --- | --- | --- |
| selected when | no `NPM_PUBLISH_TOKEN` secret | the secret is set |
| credential | GitHub signs an OIDC token, npm exchanges it for a short-lived one | a long-lived npm token |
| what can leak | nothing | the token, until it is rotated |
| two-factor | not involved | a classic token triggers an OTP prompt npm cannot answer |

**The secret's absence is the switch.** Nothing else has to change to move
between the two.

## Setting up trusted publishing

```bash
npm install -g npm@latest
npm login
```

`npm trust` is interactive by design. It rejects bypass-2FA tokens, because
creating a trusted publisher is an *account-governance* action, and it rejects
legacy username/password credentials too. `npm login` - the browser flow, with
2FA - is the only way in.

Then:

```bash
npm trust github @flipova/foundation \
  --file release.yml \
  --repository flipova/foundation \
  --allow-publish
```

| Flag | Value | Why |
| --- | --- | --- |
| `--file` | `release.yml` | **the filename only, not a path.** It must name the workflow that actually runs the publish, which is `.github/workflows/release.yml` |
| `--repository` | `flipova/foundation` | `owner/repo` |
| `--allow-publish` | - | permits `npm publish`. The alternative is `--allow-stage-publish`, which stages a version for a maintainer to approve |

`--environment` is only needed if the workflow uses a [GitHub
environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment).
Ours does not.

Check and remove:

```bash
npm trust list @flipova/foundation          # shows the trust id
npm trust revoke @flipova/foundation --id <id>
```

npm allows only **one** trusted publisher per package. To change it, revoke
first; creating over an existing one is an error.

## Switching the workflow over

Delete the `NPM_PUBLISH_TOKEN` secret - **Settings → Secrets and variables →
Actions → npm publish token → Delete**.

That is the whole switch. Leave it in place if you want a fallback: the token
path stays in use, and it will keep failing with `EOTP` for as long as the token
is a classic one and the account has 2FA on writes.

## Publishing what is pending

```bash
# 1. merge the PR that enables OIDC
# 2. delete NPM_PUBLISH_TOKEN
# 3. publish
```

Then **Actions → Release → Run workflow**, with `hotfix = true` and a reason.
The preflight refuses to publish from an ordinary commit on `main`; the hotfix
dispatch is the sanctioned way to publish a version whose pull request is
already merged.

If the version is already on the registry, the preflight reports nothing to do
and exits cleanly.

## When a publish fails

`release:ci` turns the npm failure into the action that fixes it. If you run
`npm run release` by hand instead, the table is:

| Error | Meaning | Fix |
| --- | --- | --- |
| `EOTP` | the token is **classic** and the account has 2FA on "authorization and writes" | use an automation token, or move to trusted publishing |
| `E401` | the secret is empty, revoked, or from another registry | restore a live npmjs token |
| `E403` | valid token, no publish permission here | grant write access to the `@flipova` scope |
| `E404` | npm hides a permission problem as "not found" | same as `E403`, and check the package name |
| `E409` | that version is already published | bump again rather than retrying |

## Three things that look like authentication bugs and are not

**npm is too old.** Trusted publishing needs npm **11.5.1+** and Node
**22.14+**. `actions/setup-node` gives us Node 22 but keeps the npm bundled with
it, which is 10.9.x - old enough that the OIDC exchange does not exist and the
failure says nothing about the npm version. The workflow runs
`npm install -g npm@latest` in OIDC mode for exactly this.

**`.npmrc` overrides OIDC.** `changesets/action` only writes a `.npmrc` when it
finds none, so the workflow writes it first - and in OIDC mode it contains the
registry and **no credential at all**. An `_authToken` line takes precedence
over OIDC and silently defeats it.

**`npm whoami` will not tell you.** npm is explicit that neither `npm whoami`
nor `npm access` is a check of trusted publishing permissions, and that both
still require traditional authentication. In OIDC mode the preflight skips them
for that reason: running them would fail a run that would have published fine.
**The publish itself is the only real check.**

## Why not keep the token

npm is closing the door:

> Bypass-2FA tokens with direct-publish access are being deprecated. The
> ability to publish new package versions directly with a granular access token
> will be removed in **January 2027**.

An automation token works today and is the right fallback. Trusted publishing is
what is left after that date, and npm's own recommendation
([docs.npmjs.com/trusted-publishers](https://docs.npmjs.com/trusted-publishers)).

## Versions and the registry

The registry has 1.14.0; `main` is 2.0.2. The changelog therefore lists 2.0.0
and 2.0.1, which were never published. Consumers can only install 2.0.2 and
later. Unpublishing those two entries from the changelog is a judgement call,
not a tooling problem.
