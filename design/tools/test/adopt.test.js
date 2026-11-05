'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { REQUIRED_ROLES, missingRoles } = require('../lib/contract');

const CLI = path.resolve(__dirname, '..', 'cli.js');
const run = (cwd, ...args) => spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
const project = () => {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'adopt-')));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'app', version: '1.0.0', scripts: {} }));
  return root;
};

test('adopt copies a neutral starter, rewrites the outputs into theme/, and gen writes the project theme', () => {
  const root = project();
  const a = run(root, 'adopt');
  assert.equal(a.status, 0, a.stderr);
  const manifest = fs.readFileSync(path.join(root, 'design/manifest.xml'), 'utf8');
  assert.match(manifest, /<designTheme>theme\/design-theme\.ts<\/designTheme>/);
  assert.match(manifest, /<gluestackConfig>theme\/config\.ts<\/gluestackConfig>/);
  const provider = fs.readFileSync(path.join(root, 'theme/provider.tsx'), 'utf8');
  assert.match(provider, /FlipovaProvider/);
  assert.match(provider, /from '\.\/design-theme'/);
  const g = run(root, 'gen');
  assert.equal(g.status, 0, g.stderr);
  const theme = fs.readFileSync(path.join(root, 'theme/design-theme.ts'), 'utf8');
  assert.match(theme, /export const designTheme/);
  assert.doesNotMatch(theme, /spring/i);
  // nothing was written inside the package
  assert.equal(run(root, 'gen', '--check').status, 0);
});

test('the starter names no brand or season: only light and dark', () => {
  const themes = fs.readFileSync(path.resolve(__dirname, '..', '..', 'themes.xml'), 'utf8');
  assert.deepEqual(
    [...themes.matchAll(/<theme id="([^"]+)"/g)].map((m) => m[1]),
    ['light', 'dark'],
  );
});

test('REQUIRED_ROLES is the list the TypeScript contract reads', () => {
  const ts = fs.readFileSync(path.resolve(__dirname, '..', '..', '..', 'components/contract/theme.ts'), 'utf8');
  const block = /REQUIRED_ROLES = \[([\s\S]*?)\] as const/.exec(ts)[1];
  const camel = [...block.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]);
  const kebab = camel.map((c) => c.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`));
  assert.deepEqual(kebab, REQUIRED_ROLES);
});

test('missingRoles names what a theme lacks', () => {
  const full = Object.fromEntries(REQUIRED_ROLES.map((r) => [r, '1 2 3']));
  const lacking = { ...full };
  delete lacking.ring;
  delete lacking['info-foreground'];
  assert.deepEqual(missingRoles({ a: full, b: lacking }), { b: ['ring', 'info-foreground'] });
});
