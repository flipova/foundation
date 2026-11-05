'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { start, paletteFrom } = require('../lib/gui');

const CLI = path.resolve(__dirname, '..', 'cli.js');
const DIST = path.resolve(__dirname, '..', '..', '..', 'dist', 'contract', 'index.js');

async function boot() {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gui-')));
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ name: 'app', version: '1.0.0' }));
  assert.equal(spawnSync(process.execPath, [CLI, 'adopt'], { cwd: root }).status, 0);
  const gui = await start({ designDir: path.join(root, 'design'), outputRoot: root, out: () => {} });
  const call = (method, p, { body, token = gui.token, host } = {}) =>
    new Promise((resolve, reject) => {
      const data = body === undefined ? null : typeof body === 'string' ? body : JSON.stringify(body);
      const req = http.request(
        {
          host: '127.0.0.1',
          port: gui.port,
          path: p,
          method,
          headers: {
            ...(host ? { host } : {}),
            ...(token ? { 'x-flipova-token': token } : {}),
            ...(data ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(data) } : {}),
          },
        },
        (res) => {
          const parts = [];
          res.on('data', (c) => parts.push(c));
          res.on('end', () => {
            const text = Buffer.concat(parts).toString('utf8');
            let json = null;
            try {
              json = JSON.parse(text);
            } catch (_) {
              /* html */
            }
            resolve({ status: res.statusCode, json, text, headers: res.headers });
          });
        },
      );
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  return { root, gui, call, edit: (op) => call('POST', '/api/edit', { body: op }) };
}

test('the server answers only with the token and a loopback Host', async (t) => {
  const { gui, call } = await boot();
  t.after(() => gui.close());
  assert.equal((await call('GET', '/api/state', { token: null })).status, 403);
  assert.equal((await call('GET', '/api/state', { token: 'wrong' })).status, 403);
  assert.equal((await call('GET', '/api/state', { host: 'evil.example' })).status, 403);
  assert.equal((await call('GET', '/api/state', { host: `evil.example:${gui.port}` })).status, 403);
  assert.equal((await call('GET', '/', { token: null })).status, 403);
  const page = await call('GET', `/?t=${gui.token}`, { token: null });
  assert.equal(page.status, 200);
  assert.match(page.headers['content-security-policy'], /default-src 'none'/);
  assert.ok(page.text.includes(gui.token) && !page.text.includes('__TOKEN__'));
  assert.equal((await call('GET', '/api/state')).status, 200);
  assert.equal((await call('GET', '/nope')).status, 404);
});

test('edits stay in the working copy until Save; Save validates and regenerates', async (t) => {
  const { root, gui, call, edit } = await boot();
  t.after(() => gui.close());
  const tokensFile = path.join(root, 'design/tokens.xml');
  const before = fs.readFileSync(tokensFile, 'utf8');
  let st = (await call('GET', '/api/state')).json;
  assert.equal(st.dirty, false);
  assert.deepEqual(
    st.themes.map((x) => x.id),
    ['light', 'dark'],
  );
  assert.ok(st.themes.every((x) => x.missing.length === 0));

  const r = await edit({ type: 'setColor', id: 'primary.600', value: '#ff0066' });
  assert.equal(r.status, 200);
  assert.equal(r.json.dirty, true);
  assert.equal(
    typeof r.json.previewAvailable,
    'boolean',
    'every state the page receives says whether the preview exists',
  );
  assert.equal(r.json.registry.themes.light.colors.primary, '#ff0066');
  assert.equal(fs.readFileSync(tokensFile, 'utf8'), before, 'the project is untouched before Save');

  const v = (await call('POST', '/api/validate', { body: {} })).json;
  assert.equal(v.ok, true, JSON.stringify(v.steps));

  const s = (await call('POST', '/api/save', { body: {} })).json;
  assert.equal(s.ok, true, JSON.stringify(s.steps));
  assert.match(fs.readFileSync(tokensFile, 'utf8'), /primary\.600">#ff0066</);
  assert.match(fs.readFileSync(path.join(root, 'theme/design-theme.ts'), 'utf8'), /"primary": "#ff0066"/);
  assert.equal(
    spawnSync(process.execPath, [CLI, 'verify'], { cwd: root }).status,
    0,
    'canonical index written by Save',
  );
  assert.equal((await call('GET', '/api/state')).json.dirty, false);
});

test('refused edits say why and change nothing; revert restores the saved state', async (t) => {
  const { gui, call, edit } = await boot();
  t.after(() => gui.close());
  const bad = [
    [{ type: 'setColor', id: 'primary.600', value: 'blue' }, /not a colour/],
    [{ type: 'setColor', id: 'nope.1', value: '#000000' }, /not found/],
    [{ type: 'setScale', scale: 'spacing', id: '4', value: '1rem' }, /not a number/],
    [{ type: 'setScale', scale: 'nope', id: '4', value: '1' }, /unknown scale/],
    [{ type: 'addTheme', id: 'x', mode: 'sepia', variant: 'v', from: 'light' }, /mode must be/],
    [{ type: 'removeColor', id: 'gray.50' }, /used by a theme/],
    [{ type: 'explode' }, /unknown operation/],
    [{ type: 'setColor', id: 'primary.600' }, /missing "value"/],
  ];
  for (const [op, msg] of bad) {
    const r = await edit(op);
    assert.equal(r.status, 400, JSON.stringify(op));
    assert.match(r.json.error, msg);
  }
  assert.equal((await call('GET', '/api/state')).json.dirty, false);
  await edit({ type: 'addTheme', id: 'brand-light', mode: 'light', variant: 'brand', from: 'light' });
  await edit({ type: 'addTheme', id: 'brand-dark', mode: 'dark', variant: 'brand', from: 'dark' });
  await edit({ type: 'setRole', theme: 'brand-light', role: 'primary', ref: '$ref.tokens.color.primary.800' });
  let st = (await call('GET', '/api/state')).json;
  assert.deepEqual(
    st.themes.map((x) => x.id),
    ['light', 'brand-light', 'dark', 'brand-dark'],
  );
  assert.equal(st.registry.variants.brand.light, 'brand-light');
  st = (await edit({ type: 'revert' })).json;
  assert.equal(st.dirty, false);
  assert.deepEqual(
    st.themes.map((x) => x.id),
    ['light', 'dark'],
  );
});

test('a palette is built from one colour and a broken registry is not saved', async (t) => {
  const { root, gui, call, edit } = await boot();
  t.after(() => gui.close());
  const shades = paletteFrom('#336699');
  assert.equal(shades['500'], '#336699');
  assert.ok(parseInt(shades['50'].slice(1), 16) > parseInt(shades['500'].slice(1), 16));
  assert.ok(parseInt(shades['950'].slice(1), 16) < parseInt(shades['500'].slice(1), 16));
  assert.equal((await edit({ type: 'palette', name: 'brand', base: '#336699' })).status, 200);
  const st = (await call('GET', '/api/state')).json;
  assert.equal(st.colors.filter((c) => c.id.startsWith('brand.')).length, 11);
  assert.equal((await edit({ type: 'palette', name: 'bad name', base: '#336699' })).status, 400);
  // a theme that loses a role the components read: Validate and Save refuse, the project keeps its files
  gui.workspace.write(
    'themes.xml',
    gui.workspace.read('themes.xml').replace(/\s*<role id="ring">[\s\S]*?<\/role>/, ''),
  );
  const v = (await call('POST', '/api/validate', { body: {} })).json;
  assert.equal(v.ok, false);
  assert.match(JSON.stringify(v.steps), /ring/);
  const before = fs.readFileSync(path.join(root, 'design/themes.xml'), 'utf8');
  assert.equal((await call('POST', '/api/save', { body: {} })).json.ok, false);
  assert.equal(fs.readFileSync(path.join(root, 'design/themes.xml'), 'utf8'), before);
});

test('requests with a bad body are refused', async (t) => {
  const { gui, call } = await boot();
  t.after(() => gui.close());
  assert.equal((await call('POST', '/api/edit', { body: '{not json' })).status, 400);
  const big = await call('POST', '/api/edit', {
    body: JSON.stringify({ type: 'setColor', pad: 'x'.repeat(2 * 1024 * 1024) }),
  }).catch((e) => ({ status: 0, error: e }));
  assert.ok(big.status === 400 || big.status === 0);
});

test('the preview draws the real recipes of the theme (needs the built package)', async (t) => {
  if (!fs.existsSync(DIST)) {
    if (process.env.FLIPOVA_REQUIRE_DIST) assert.fail('dist/ is required for this test but is not built');
    return t.skip('dist/ not built: run `npm run build` first');
  }
  const { gui, call, edit } = await boot();
  t.after(() => gui.close());
  await edit({ type: 'setColor', id: 'primary.600', value: '#ff0066' });
  const p = (await call('GET', '/api/preview?theme=light')).json;
  assert.equal(p.available, true);
  assert.deepEqual(p.groups.map((g) => g.title).slice(0, 3), ['Button', 'Heading & Text', 'Fields']);
  const flat = JSON.stringify(p.groups);
  assert.match(flat, /"backgroundColor":"#ff0066"/, 'the primary button carries the edited colour');
  assert.equal((await call('GET', '/api/preview?theme=nope')).status, 404);
});
