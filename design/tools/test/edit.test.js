'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const edit = require('../lib/edit');

const DESIGN = path.resolve(__dirname, '..', '..');
const CLI = path.join(DESIGN, 'tools', 'cli.js');
const read = (f) => fs.readFileSync(path.join(DESIGN, f), 'utf8');
const diffLines = (a, b) => {
  const x = a.split('\n');
  const y = b.split('\n');
  return { removed: x.filter((l) => !y.includes(l)), added: y.filter((l) => !x.includes(l)) };
};

test('setValue changes one value and nothing else (comments, order, indentation kept)', () => {
  const xml = read('tokens.xml');
  const out = edit.setValue(xml, 'color', 'primary.600', '#112233', 'color');
  assert.deepEqual(diffLines(xml, out), {
    removed: ['                <value id="primary.600">#2563EB</value>'],
    added: ['                <value id="primary.600">#112233</value>'],
  });
  const sp = edit.setValue(xml, 'spacing', '4', '18', 'scale');
  assert.equal(diffLines(xml, sp).added.length, 1);
});

test('setValue refuses what is not a colour / a number / an existing value', () => {
  const xml = read('tokens.xml');
  assert.throws(() => edit.setValue(xml, 'color', 'primary.600', 'blue', 'color'), /not a colour/);
  assert.throws(() => edit.setValue(xml, 'color', 'primary.600', '#12', 'color'), /not a colour/);
  assert.throws(() => edit.setValue(xml, 'spacing', '4', '1rem', 'scale'), /not a number/);
  assert.throws(() => edit.setValue(xml, 'color', 'nope.1', '#000', 'color'), /not found/);
  assert.throws(() => edit.setValue(xml, 'nope', '1', '1', 'scale'), /token "nope" not found/);
  assert.throws(() => edit.setValue(xml, 'color', 'primary.600', '#000"><x/>', 'color'), /not a colour/);
});

test('addValue / removeValue', () => {
  const xml = read('tokens.xml');
  const added = edit.addValue(xml, 'color', 'brand.500', '#ff0066', 'color');
  assert.deepEqual(diffLines(xml, added).added, ['                <value id="brand.500">#ff0066</value>']);
  assert.throws(() => edit.addValue(added, 'color', 'brand.500', '#000', 'color'), /already exists/);
  assert.throws(() => edit.addValue(xml, 'color', 'bad id', '#000', 'color'), /not a valid id/);
  assert.equal(edit.removeValue(added, 'color', 'brand.500'), xml);
  assert.throws(() => edit.removeValue(xml, 'color', 'brand.500'), /not found/);
});

test('setRole takes a reference or a colour, only valid ones', () => {
  const xml = read('themes.xml');
  const out = edit.setRole(xml, 'light', 'primary', { ref: '$ref.tokens.color.primary.700' });
  assert.deepEqual(diffLines(xml, out).added, ['                    <ref>$ref.tokens.color.primary.700</ref>']);
  const lit = edit.setRole(xml, 'dark', 'ring', { value: '#abcdef' });
  assert.match(lit, /<role id="ring">\s*<value>#abcdef<\/value>/);
  assert.throws(() => edit.setRole(xml, 'light', 'primary', { ref: 'primary.700' }), /reference/);
  assert.throws(() => edit.setRole(xml, 'light', 'primary', { value: 'red' }), /not a colour/);
  assert.throws(() => edit.setRole(xml, 'light', 'primary', {}), /reference or a colour/);
  assert.throws(() => edit.setRole(xml, 'light', 'nope', { ref: '$ref.tokens.color.white' }), /role "nope" not found/);
});

test('addTheme copies a theme; removeTheme and rename keep `default` valid', () => {
  const xml = read('themes.xml');
  const added = edit.addTheme(xml, { id: 'night', mode: 'dark', variant: 'brand', from: 'dark' });
  assert.deepEqual(edit.themeIds(added), ['light', 'dark', 'night']);
  assert.match(added, /<theme id="night" mode="dark" variant="brand">/);
  assert.throws(
    () => edit.addTheme(added, { id: 'night', mode: 'dark', variant: 'x', from: 'dark' }),
    /already exists/,
  );
  assert.throws(
    () => edit.addTheme(xml, { id: '1bad', mode: 'dark', variant: 'x', from: 'dark' }),
    /not a valid theme id/,
  );
  assert.throws(() => edit.addTheme(xml, { id: 'ok', mode: 'sepia', variant: 'x', from: 'dark' }), /mode must be/);
  assert.equal(edit.removeTheme(added, 'night'), xml);
  const renamed = edit.setThemeAttrs(xml, 'light', { newId: 'day' });
  assert.match(renamed, /default="day"/);
  const removed = edit.removeTheme(xml, 'light');
  assert.match(removed, /default="dark"/);
  assert.throws(() => edit.removeTheme(removed, 'dark'), /at least one theme/);
});

test('a registry edited through these functions still passes gen, canonical, check and lint', () => {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'edit-')));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'app', version: '1.0.0' }));
  const run = (...a) => spawnSync(process.execPath, [CLI, ...a], { cwd: root, encoding: 'utf8' });
  assert.equal(run('adopt').status, 0);
  const t = path.join(root, 'design/tokens.xml');
  const h = path.join(root, 'design/themes.xml');
  let tokens = fs.readFileSync(t, 'utf8');
  let themes = fs.readFileSync(h, 'utf8');
  tokens = edit.addValue(tokens, 'color', 'brand.500', '#ff0066', 'color');
  tokens = edit.setValue(tokens, 'spacing', '4', '18', 'scale');
  themes = edit.addTheme(themes, { id: 'brand-light', mode: 'light', variant: 'brand', from: 'light' });
  themes = edit.addTheme(themes, { id: 'brand-dark', mode: 'dark', variant: 'brand', from: 'dark' });
  themes = edit.setRole(themes, 'brand-light', 'primary', { ref: '$ref.tokens.color.brand.500' });
  fs.writeFileSync(t, tokens);
  fs.writeFileSync(h, themes);
  for (const cmd of [['gen'], ['canonical'], ['check'], ['lint'], ['verify']]) {
    const r = run(...cmd);
    assert.equal(r.status, 0, `${cmd.join(' ')}: ${r.stdout}${r.stderr}`);
  }
  const out = fs.readFileSync(path.join(root, 'theme/design-theme.ts'), 'utf8');
  assert.match(out, /"brand-light"/);
  assert.match(out, /"primary": "#ff0066"/);
});
