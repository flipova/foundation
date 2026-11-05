#!/usr/bin/env node
/**
 * `npm run ci:verify` — everything CI checks, in one place.
 *
 * The pipeline file (.github/workflows/release.yml) is the same in every Corral repository and carries no logic of its own:
 * what proves THIS repository fit to ship is decided here. Change the list below, never the YAML.
 * Every step runs even if an earlier one failed, so one run shows all the problems; the exit code is 1 if any failed.
 *
 *   node scripts/ci-verify.js          run everything
 *   node scripts/ci-verify.js --list   print the steps
 */
const { spawnSync } = require('node:child_process');

const STEPS = [
  { name: 'lint', args: ['run', 'lint'] },
  { name: 'format', args: ['run', 'format:check'] },
  { name: 'types', args: ['run', 'typecheck'] },
  { name: 'build', args: ['run', 'build'] },
  // dist/ exists at this point, so the GUI preview test must run (it is skipped locally without a build)
  { name: 'tests', args: ['test'], env: { FLIPOVA_REQUIRE_DIST: '1' } },
  // the registry is the single source of truth: a generated file that drifted from it fails here
  { name: 'design registry up to date', args: ['run', 'design:gen:check'] },
  { name: 'design pipeline (gen, check, verify, lint)', args: ['run', 'design:pipeline'] },
  { name: 'npm tarball is publishable', args: ['pack', '--dry-run'] },
];

if (process.argv.includes('--list')) {
  for (const s of STEPS) console.log(`${s.name}: npm ${s.args.join(' ')}`);
  process.exit(0);
}

const failed = [];
for (const s of STEPS) {
  console.log(`\n▸ ${s.name}  (npm ${s.args.join(' ')})`);
  const r = spawnSync('npm', s.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...s.env },
  });
  if (r.status !== 0) failed.push(s.name);
}
console.log(
  `\n${failed.length ? `✖ ${failed.length}/${STEPS.length} failed: ${failed.join(', ')}` : `✔ ${STEPS.length}/${STEPS.length} passed`}`,
);
process.exit(failed.length ? 1 : 0);
