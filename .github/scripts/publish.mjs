#!/usr/bin/env node
/**
 * `npm run release`, with a failure that says what to do.
 *
 * The point is not the publish, it is the diagnosis. `npm whoami` and
 * `npm access get status` both succeed with a classic token on a 2FA-enabled
 * account, so the preflight passes and the run only fails at the end, after a
 * full build, with npm's raw output. Every failure below is therefore mapped to
 * the one action that fixes it, as a GitHub annotation a maintainer sees without
 * opening the log.
 *
 * npm publishes with a classic token only if the account has no 2FA on writes;
 * a granular/automation token with "bypass 2FA" always works. That difference is
 * invisible to every command npm offers before publishing, which is exactly why
 * it has to be explained here rather than pre-checked.
 */
import { spawn } from 'node:child_process';

const KNOWN = [
  {
    match: /EOTP/,
    code: 'EOTP',
    what: 'npm asked for a one-time password.',
    why: 'The token is a **classic** token and the account has 2FA set to "authorization and writes". npm only lets a classic token publish interactively.',
    fix: [
      'npmjs.com -> Access Tokens -> Generate New Token -> **Automation**',
      'expiration: as long as possible; scope: publish only to @flipova',
      'replace the NPM_PUBLISH_TOKEN secret with it',
      'an automation token bypasses 2FA, so no OTP is ever asked for',
    ],
  },
  {
    match: /ENEEDAUTH|E401|not authenticated/i,
    code: 'E401',
    what: 'npm did not accept the credentials.',
    why: 'The secret is empty, revoked, or belongs to another registry.',
    fix: ['check that NPM_PUBLISH_TOKEN holds a live npmjs.com token', 'run the release with `hotfix = true` and a reason once it does'],
  },
  {
    match: /E403/,
    code: 'E403',
    what: 'Authenticated, but not allowed to publish this package.',
    why: 'The token is valid but has no publish permission on this package.',
    fix: ['grant the token write access to the @flipova scope', 'or add the token as a collaborator on the package'],
  },
  {
    match: /EPUBLISHCONFLICT|E409|cannot publish over/i,
    code: 'E409',
    what: 'That version already exists on the registry.',
    why: 'The version was published by an earlier run that failed afterwards.',
    fix: ['check `npm view @flipova/foundation versions`', 'bump again rather than retrying the same version'],
  },
  {
    match: /E404/,
    code: 'E404',
    what: 'The package or the version was not found, or access was denied.',
    why: 'On a publish, this is usually a permission problem that npm reports as "not found".',
    fix: ['check the scope access of the token', 'check the package name in package.json'],
  },
];

export const explain = (text) => {
  const found = KNOWN.find((k) => k.match.test(text));
  if (!found) return null;
  const gha = (msg) => console.log(`::error::${msg}`);
  gha(`npm publish failed with ${found.code}: ${found.what}`);
  console.log('');
  console.log(`  why: ${found.why}`);
  console.log('');
  console.log('  fix:');
  for (const step of found.fix) console.log(`    - ${step}`);
  console.log('');
  return found.code;
};

export const run = () => {
  const child = spawn('npm', ['run', 'release'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });

  let seen = '';
  const tee = (stream) => {
    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      process.stdout.write(chunk);
      seen += chunk;
      // Keep the tail: npm puts the error at the end, and an unbounded buffer
      // would grow with the build log.
      if (seen.length > 200_000) seen = seen.slice(-100_000);
    });
  };
  tee(child.stdout);
  tee(child.stderr);

  child.on('close', (code) => {
    if (code === 0) {
      console.log('');
      console.log('  published.');
      return;
    }
    const explained = explain(seen);
    if (!explained) {
      // Never swallow an unrecognised failure into a vague message.
      console.log('');
      console.log(`  npm exited with ${code} and the error is not one this wrapper knows.`);
      console.log('  The full output is above; the npm debug log is in ~/.npm/_logs.');
    }
    process.exitCode = code ?? 1;
  });
};

// Only publish when run as the entry point, so the classifier above can be
// exercised without ever touching the registry.
if (process.argv[1] && process.argv[1].endsWith('publish.mjs')) run();
