'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { check } = require('./check-docs');

const REAL = path.resolve(__dirname, '..');

/** A throwaway package root: real code (symlinked), the given docs. */
function root(docs) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-guard-'));
  for (const f of ['components', 'design']) fs.symlinkSync(path.join(REAL, f), path.join(dir, f), 'dir');
  for (const f of ['package.json', 'index.ts', 'COMPONENTS.md']) fs.copyFileSync(path.join(REAL, f), path.join(dir, f));
  for (const [name, text] of Object.entries(docs)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), text);
  }
  return dir;
}
const rules = (docs) => check(root(docs)).map((v) => v.rule);

test('the real repository documentation matches the code', () => {
  assert.deepEqual(check(REAL), []);
});

test('a prop that FlipovaProvider does not have is refused', () => {
  assert.deepEqual(rules({ 'README.md': '<FlipovaProvider adapter={a} registry={r}>' }), ['provider-prop']);
  assert.deepEqual(rules({ 'README.md': '<FlipovaProvider adapter={a} theme={t} mode="dark">' }), []);
});

test('an unknown CLI command and an unknown npm script are refused', () => {
  assert.deepEqual(rules({ 'README.md': 'npx flipova-design frobnicate' }), ['cli-command']);
  assert.deepEqual(rules({ 'README.md': 'npm run nope' }), ['npm-script']);
  assert.deepEqual(rules({ 'README.md': 'npx flipova-design gen and npm run boundary' }), []);
});

test('a sub-path that package.json does not export is refused', () => {
  assert.deepEqual(rules({ 'README.md': '`@flipova/foundation/providers/nope`' }), ['import-path']);
  assert.deepEqual(rules({ 'README.md': '`@flipova/foundation/providers/paper` and @flipova/foundation@3.0.0' }), []);
});

test('a name the root does not export is refused', () => {
  assert.deepEqual(rules({ 'README.md': "import { Button, Nope } from '@flipova/foundation';" }), ['named-import']);
});

test('a wrong component or role count is refused', () => {
  assert.deepEqual(rules({ 'README.md': '999 components' }), ['count']);
  assert.deepEqual(rules({ 'README.md': '3 rôles' }), ['count']);
});

test('a missing link target and a left-over fill-in zone are refused', () => {
  assert.deepEqual(rules({ 'README.md': '[x](NOPE.md)' }), ['link']);
  assert.deepEqual(rules({ 'documentation/v1.0/a.md': '[?à remplir]' }), ['placeholder']);
});

test('the reference must list every prop, command and export', () => {
  const found = rules({ 'documentation/v1.0/FLP-REF-001_x.md': 'nothing' });
  assert.ok(found.includes('provider-undoc') && found.includes('cli-undoc') && found.includes('export-undoc'));
});
