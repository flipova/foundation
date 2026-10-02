---
'@flipova/foundation': patch
---

Publish with trusted publishing (OIDC): no secret, no two-factor prompt, and it
survives the January 2027 removal of direct publishing with bypass-2FA tokens.

The release workflow had one authentication path, and it was a long-lived
`NPM_PUBLISH_TOKEN`. npm is closing that door - "the ability to publish new
package versions directly with a granular access token will be removed in
January 2027" - and its own recommendation is trusted publishing.

Trusted publishing stores no secret. GitHub signs an OIDC token for the
workflow, npm exchanges it for a short-lived registry token, and there is
nothing to rotate or leak.

Two modes, chosen by whether the secret exists, so moving between them is
deleting a secret and nothing else:

- `id-token: write` on the publishing job. `packages: write` is dropped: the
  package goes to npmjs.org, never to GitHub Packages. A job-level
  permissions block replaces the workflow-level one, so the rest is restated.
- `npm install -g npm@latest` before publishing. Trusted publishing needs npm
  11.5.1+ and Node 22.14+, and `actions/setup-node` keeps the npm bundled with
  Node 22 - 10.9.x, where the OIDC exchange does not exist and the failure
  says nothing about the npm version.
- the `.npmrc` is written by the workflow rather than by `changesets/action`.
  The action only creates one when it finds none, so writing it first is what
  decides the authentication, and an `_authToken` line would take precedence
  over OIDC and break it. In OIDC mode the file carries the registry and no
  credential at all.
- the preflight stops running `npm whoami` and `npm access` in OIDC mode. npm
  is explicit that neither is a check of trusted publishing permissions and
  that both still require traditional authentication, so they would fail a run
  that would have published perfectly. A missing `id-token: write` is reported
  by name instead of surfacing as an opaque publish error.

Configuring it needs a logged-in human: `npm trust` rejects bypass-2FA tokens,
because creating a trusted publisher is an account-governance action.
