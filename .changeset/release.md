---
'@flipova/foundation': patch
---

Make a failed npm publish name its fix.

The publish of 2.0.2 failed with `EOTP` after a preflight that passed. npm was
not rejecting the token: it accepted it. `npm whoami` and `npm access get
status` both succeeded, the build ran, and only the actual publish was refused,
because the account has 2FA on "authorization and writes" - npm's default - and
a classic token only publishes interactively.

npm's rule, from its own documentation:

> Publishing to npm requires either: Two-factor authentication (2FA) enabled
> on your account, OR a granular access token with bypass 2FA enabled.

No npm command tells a classic token from an automation one before publishing,
so this cannot be pre-checked. It can only be explained:

- `release:ci` wraps `npm run release` and turns the npm failure into the action
  that fixes it. `EOTP`, `E401`, `E403`, `E409` and `E404` each state their cause
  and their fix; an unrecognised failure says so rather than being dressed up.
- the preflight states the token requirement as a notice and in the job summary,
  instead of leaving a maintainer to rediscover it after a full build.

The fix for this failure is an npm **automation** token scoped to publish on
`@flipova`; it bypasses 2FA, so no one-time password is ever requested.
