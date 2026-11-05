'use strict';
/**
 * `flipova-design gui` -- a local, dependency-free editor for the design registries.
 *
 * The server listens on 127.0.0.1 only, on a random port, and every request must carry the token printed at start
 * (the page itself is served at /?t=<token>); the Host header must be the loopback address, so another page in the
 * browser, or a DNS-rebinding trick, cannot drive it. It never takes a path from the browser: the only files it
 * writes are the registry files and the generated artifacts, in the project it was started in.
 *
 * Edits go to a working copy in the OS temp folder. Nothing in the project changes until Save, and Save validates
 * first (generation, determinism rules, XSD) and writes only if all of it passes.
 */
const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const edit = require('./edit');
const { REQUIRED_ROLES } = require('./contract');
const { loadManifest, renderDesignTheme } = require('./generate');

const CLI = path.resolve(__dirname, '..', 'cli.js');
const PAGE = path.resolve(__dirname, '..', 'gui', 'index.html');
const PACKAGE_ROOT = path.resolve(__dirname, '..', '..', '..');

const SCALES = [
  'spacing',
  'radii',
  'fontSizes',
  'fontWeights',
  'lineHeights',
  'letterSpacings',
  'opacity',
  'duration',
  'zIndex',
  'breakpoints',
];
const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

// --- colour helpers ----------------------------------------------------------------------------------------------------

function parseHex(hex) {
  let d = hex.replace('#', '');
  if (d.length === 3) d = [...d].map((c) => c + c).join('');
  const n = parseInt(d, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (rgb) =>
  '#' +
  rgb
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

/** shade id -> how far the base colour (the 500) is mixed towards white (<0.5) or black (>0.5) */
const SHADE_MIX = {
  50: 0.95,
  100: 0.9,
  200: 0.75,
  300: 0.58,
  400: 0.3,
  500: 0,
  600: 0.15,
  700: 0.3,
  800: 0.45,
  900: 0.6,
  950: 0.75,
};

/** A palette from one base colour: the base is the 500, lighter shades towards white, darker towards black. */
function paletteFrom(base) {
  if (!edit.HEX.test(base)) throw new Error(`"${base}" is not a colour (#RGB or #RRGGBB)`);
  const b = parseHex(base);
  return Object.fromEntries(
    Object.entries(SHADE_MIX).map(([shade, t]) => [
      shade,
      toHex(Number(shade) < 500 ? mix(b, [255, 255, 255], t) : mix(b, [0, 0, 0], t)),
    ]),
  );
}

// --- the working copy --------------------------------------------------------------------------------------------------

class Workspace {
  /** @param {{designDir: string, outputRoot: string}} where */
  constructor({ designDir, outputRoot }) {
    this.designDir = designDir;
    this.outputRoot = outputRoot;
    this.tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'flipova-gui-')));
    this.work = path.join(this.tmp, 'design');
    fs.mkdirSync(this.work);
    for (const f of ['manifest.xml', 'schema.xsd', 'canonical.index.txt', 'tokens.xml', 'themes.xml'])
      if (fs.existsSync(path.join(designDir, f))) fs.copyFileSync(path.join(designDir, f), path.join(this.work, f));
    fs.writeFileSync(
      path.join(this.tmp, 'package.json'),
      fs.existsSync(path.join(outputRoot, 'package.json'))
        ? fs.readFileSync(path.join(outputRoot, 'package.json'))
        : '{"name":"app","version":"0.0.0"}',
    );
    this.saved = { tokens: this.read('tokens.xml'), themes: this.read('themes.xml') };
    this.log = [];
  }

  read(f) {
    return fs.readFileSync(path.join(this.work, f), 'utf8');
  }

  write(f, text) {
    fs.writeFileSync(path.join(this.work, f), text, 'utf8');
  }

  get dirty() {
    return this.read('tokens.xml') !== this.saved.tokens || this.read('themes.xml') !== this.saved.themes;
  }

  dispose() {
    fs.rmSync(this.tmp, { recursive: true, force: true });
  }

  /** the registry as the components read it (design-theme.ts evaluated), or the error that prevents it */
  registry() {
    try {
      const man = loadManifest(this.tmp, path.join(this.work, 'manifest.xml'));
      const src = renderDesignTheme(man);
      const body = src.slice(
        src.indexOf('export const designTheme = ') + 'export const designTheme = '.length,
        src.indexOf('} as const;') + 1,
      );
      return { registry: new Function(`return (${body})`)(), error: null };
    } catch (e) {
      return { registry: null, error: String(e.message || e) };
    }
  }

  /** every colour / scale / theme of the working copy, for the page */
  state() {
    const { registry, error } = this.registry();
    const tokens = this.read('tokens.xml');
    const themesXml = this.read('themes.xml');
    const values = (token) => {
      try {
        const b = tokenBlock(tokens, token);
        return [...b.matchAll(/<value\s[^>]*\bid="([^"]+)"[^>]*>([^<]*)<\/value>/g)].map((m) => ({
          id: m[1],
          value: m[2].trim(),
        }));
      } catch {
        return [];
      }
    };
    const colors = values('color');
    const themes = [...themesXml.matchAll(/<theme\s([^>]*)>([\s\S]*?)<\/theme>/g)].map((m) => {
      const attr = (n) => new RegExp(`\\b${n}="([^"]*)"`).exec(m[1])?.[1] ?? '';
      const id = attr('id');
      const resolved = registry?.themes?.[id]?.colors ?? {};
      const roles = [...m[2].matchAll(/<role\s[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/role>/g)].map((r) => {
        const ref = /<ref>([^<]*)<\/ref>/.exec(r[2])?.[1]?.trim();
        const value = /<value>([^<]*)<\/value>/.exec(r[2])?.[1]?.trim();
        return {
          id: r[1],
          ref: ref ?? null,
          value: value ?? null,
          color: resolved[camel(r[1])] ?? null,
          required: REQUIRED_ROLES.includes(r[1]),
        };
      });
      const have = new Set(roles.map((r) => r.id));
      return {
        id,
        mode: attr('mode'),
        variant: attr('variant') || 'default',
        roles,
        missing: REQUIRED_ROLES.filter((r) => !have.has(r)),
      };
    });
    return {
      dirty: this.dirty,
      designDir: this.designDir,
      error,
      requiredRoles: REQUIRED_ROLES,
      colors,
      scales: Object.fromEntries(SCALES.map((s) => [s, values(s)])),
      themes,
      default: /<themes\b[^>]*\bdefault="([^"]*)"/.exec(themesXml)?.[1] ?? null,
      registry,
      log: this.log.slice(-40),
    };
  }

  /** One edit. Returns nothing; throws an Error with a user-facing message when the edit is refused. */
  apply(op) {
    const need = (k) => {
      if (op[k] === undefined || op[k] === null || op[k] === '') throw new Error(`missing "${k}"`);
      return op[k];
    };
    const tokens = () => this.read('tokens.xml');
    const themes = () => this.read('themes.xml');
    switch (op.type) {
      case 'setColor':
        return this.write('tokens.xml', edit.setValue(tokens(), 'color', need('id'), need('value'), 'color'));
      case 'addColor':
        return this.write('tokens.xml', edit.addValue(tokens(), 'color', need('id'), need('value'), 'color'));
      case 'removeColor': {
        const ref = `$ref.tokens.color.${need('id')}`;
        if (themes().includes(`<ref>${ref}</ref>`))
          throw new Error(`${op.id} is used by a theme; point those roles elsewhere first`);
        return this.write('tokens.xml', edit.removeValue(tokens(), 'color', op.id));
      }
      case 'palette': {
        const name = need('name');
        if (!/^[A-Za-z][A-Za-z0-9-]*$/.test(name)) throw new Error(`"${name}" is not a valid palette name`);
        let xml = tokens();
        const have = new Set([...xml.matchAll(/<value\s[^>]*\bid="([^"]+)"/g)].map((m) => m[1]));
        for (const [shade, hex] of Object.entries(paletteFrom(need('base')))) {
          const id = `${name}.${shade}`;
          xml = have.has(id)
            ? edit.setValue(xml, 'color', id, hex, 'color')
            : edit.addValue(xml, 'color', id, hex, 'color');
        }
        return this.write('tokens.xml', xml);
      }
      case 'setScale':
        if (!SCALES.includes(need('scale'))) throw new Error(`unknown scale "${op.scale}"`);
        return this.write('tokens.xml', edit.setValue(tokens(), op.scale, need('id'), need('value'), 'scale'));
      case 'addScale':
        if (!SCALES.includes(need('scale'))) throw new Error(`unknown scale "${op.scale}"`);
        return this.write('tokens.xml', edit.addValue(tokens(), op.scale, need('id'), need('value'), 'scale'));
      case 'removeScale':
        if (!SCALES.includes(need('scale'))) throw new Error(`unknown scale "${op.scale}"`);
        return this.write('tokens.xml', edit.removeValue(tokens(), op.scale, need('id')));
      case 'setRole':
        return this.write(
          'themes.xml',
          edit.setRole(themes(), need('theme'), need('role'), op.ref ? { ref: op.ref } : { value: op.value }),
        );
      case 'addTheme':
        return this.write(
          'themes.xml',
          edit.addTheme(themes(), { id: need('id'), mode: need('mode'), variant: need('variant'), from: need('from') }),
        );
      case 'removeTheme':
        return this.write('themes.xml', edit.removeTheme(themes(), need('id')));
      case 'setTheme':
        return this.write(
          'themes.xml',
          edit.setThemeAttrs(themes(), need('id'), { newId: op.newId, mode: op.mode, variant: op.variant }),
        );
      case 'revert':
        this.write('tokens.xml', this.saved.tokens);
        return this.write('themes.xml', this.saved.themes);
      default:
        throw new Error(`unknown operation "${op.type}"`);
    }
  }

  /** CLI on the working copy: gen is skipped (outputs are the project's), the rules and the schema are checked. */
  validate() {
    const env = { ...process.env, FOUNDATION_DESIGN_DIR: this.work, FOUNDATION_PROJECT_ROOT: this.tmp };
    const steps = [];
    const run = (name, args) => {
      const r = spawnSync(process.execPath, [CLI, ...args], { env, encoding: 'utf8' });
      steps.push({ name, ok: r.status === 0, output: `${r.stdout || ''}${r.stderr || ''}`.trim() });
      return r.status === 0;
    };
    const { error } = this.registry();
    if (error) {
      steps.push({ name: 'registry', ok: false, output: error });
      return { ok: false, steps };
    }
    const state = this.state();
    for (const t of state.themes)
      if (t.missing.length)
        steps.push({
          name: `theme ${t.id}`,
          ok: false,
          output: `lacks the role(s) the components read: ${t.missing.join(', ')}`,
        });
    const roles = steps.length === 0;
    // the canonical index follows the registries; it is part of what Save writes
    const ok = run('canonical', ['canonical']) && run('check', ['check']) && run('lint', ['lint']);
    return { ok: ok && roles, steps };
  }

  /** Validate, then write the registries + canonical index to the project and regenerate the artifacts. */
  save() {
    const v = this.validate();
    if (!v.ok) return { ok: false, steps: v.steps };
    for (const f of ['tokens.xml', 'themes.xml', 'canonical.index.txt'])
      fs.copyFileSync(path.join(this.work, f), path.join(this.designDir, f));
    const env = { ...process.env };
    const gen = spawnSync(process.execPath, [CLI, 'gen'], { cwd: this.outputRoot, env, encoding: 'utf8' });
    const steps = [
      ...v.steps,
      { name: 'gen', ok: gen.status === 0, output: `${gen.stdout || ''}${gen.stderr || ''}`.trim() },
    ];
    if (gen.status === 0) this.saved = { tokens: this.read('tokens.xml'), themes: this.read('themes.xml') };
    return { ok: gen.status === 0, steps };
  }
}

function tokenBlock(xml, id) {
  const open = new RegExp(`<token\\s[^>]*\\bid="${id}"[^>]*>`).exec(xml);
  if (!open) throw new Error(`token ${id} not found`);
  return xml.slice(open.index, xml.indexOf('</token>', open.index));
}

// --- the preview -------------------------------------------------------------------------------------------------------

/** The contract the components are built from, as published (dist) -- the preview shows the real recipes. */
function loadContract() {
  const file = path.join(PACKAGE_ROOT, 'dist', 'contract', 'index.js');
  if (!fs.existsSync(file)) return null;
  return require(file);
}

const view = (style, children = []) => ({ k: 'view', style, children });
const text = (style, value) => ({ k: 'text', style, text: value });

/** Specimens of every component for one theme, as plain view/text trees the page draws. */
function specimens(contract, registry, themeId) {
  const c = contract;
  const t = c.resolveTheme(themeId, registry);
  const R = c;
  const groups = [];
  const add = (title, items) => groups.push({ title, items });

  add(
    'Button',
    ['default', 'secondary', 'outline', 'destructive', 'ghost', 'link']
      .map((variant) => {
        const r = R.buttonRecipe({ variant }, t);
        return { label: variant, node: view(r.container, [text(r.label, 'Button')]) };
      })
      .concat(
        (() => {
          const r = R.buttonRecipe({ disabled: true }, t);
          return [{ label: 'disabled', node: view(r.container, [text(r.label, 'Button')]) }];
        })(),
      ),
  );
  add('Heading & Text', [
    ...[1, 2, 3, 5].map((level) => ({
      label: `heading ${level}`,
      node: text(R.headingRecipe({ level }, t), 'The quick brown fox'),
    })),
    { label: 'text md', node: text(R.textRecipe({ size: 'md' }, t), 'Body text uses the foreground colour.') },
    { label: 'text bold', node: text(R.textRecipe({ size: 'sm', bold: true }, t), 'Small and bold') },
  ]);
  const input = R.inputRecipe({}, t);
  const area = R.textareaRecipe({}, t);
  const select = R.selectRecipe({ options: [] }, t);
  add('Fields', [
    {
      label: 'input',
      node: view(input.container, [text({ ...input.field, color: input.placeholderTextColor }, 'Placeholder')]),
    },
    {
      label: 'invalid',
      node: view(R.inputRecipe({ invalid: true }, t).container, [
        text({ ...input.field, color: input.placeholderTextColor }, 'Placeholder'),
      ]),
    },
    {
      label: 'textarea',
      node: view({ ...area.field, justifyContent: 'flex-start' }, [
        text({ color: area.placeholderTextColor, fontSize: area.field.fontSize }, 'Write something…'),
      ]),
    },
    {
      label: 'select (open)',
      node: view({ width: '100%' }, [
        view(select.trigger, [text(select.triggerLabel, 'Alpha'), text({ color: select.placeholderColor }, '▾')]),
        view(select.menu, [
          view({ ...select.option, ...select.optionSelected }, [
            text({ ...select.optionLabel, ...select.optionLabelSelected }, 'Alpha'),
          ]),
          view(select.option, [text(select.optionLabel, 'Beta')]),
        ]),
      ]),
    },
  ]);
  const cb = (checked) => R.checkboxRecipe({ checked }, t);
  const rd = R.radioRecipe({ options: [] }, t);
  const sw = R.switchRecipe({}, t);
  const knob = sw.height - 4;
  add('Choices', [
    ...[true, false].map((checked) => ({
      label: checked ? 'checked' : 'unchecked',
      node: view(cb(checked).row, [
        view(cb(checked).box, checked ? [text(cb(checked).mark, '✓')] : []),
        text(cb(checked).label, 'Label'),
      ]),
    })),
    {
      label: 'radio',
      node: view(
        rd.group,
        [true, false].map((sel) =>
          view(rd.row, [view(rd.circle(sel), sel ? [view(rd.dot)] : []), text(rd.label, sel ? 'Selected' : 'Other')]),
        ),
      ),
    },
    ...[true, false].map((on) => ({
      label: on ? 'switch on' : 'switch off',
      node: view(
        {
          width: sw.width,
          height: sw.height,
          borderRadius: 9999,
          backgroundColor: on ? sw.trackOn : sw.trackOff,
          justifyContent: 'center',
          paddingHorizontal: 2,
          alignItems: on ? 'flex-end' : 'flex-start',
        },
        [view({ width: knob, height: knob, borderRadius: 9999, backgroundColor: sw.thumb })],
      ),
    })),
  ]);
  const card = R.cardRecipe({}, t);
  add('Card & Badge', [
    {
      label: 'card',
      node: view(card, [
        text(R.headingRecipe({ level: 4 }, t), 'Card title'),
        text(R.textRecipe({ size: 'sm' }, t), 'Cards sit on the card colour with a border and a soft shadow.'),
      ]),
    },
    ...['default', 'secondary', 'destructive', 'outline'].map((variant) => {
      const r = R.badgeRecipe({ variant }, t);
      return { label: `badge ${variant}`, node: view(r.container, [text(r.label, 'New')]) };
    }),
  ]);
  add('Avatar & Divider', [
    ...['sm', 'md', 'lg', 'xl'].map((size) => {
      const r = R.avatarRecipe({ size }, t);
      return { label: size, node: view(r.container, [text(r.initials, 'AL')]) };
    }),
    { label: 'divider', node: view(R.dividerRecipe({}, t)) },
  ]);
  const tabs = R.tabsRecipe({ tabs: [] }, t);
  add('Tabs', [
    {
      label: 'tabs',
      node: view({ width: '100%' }, [
        view(tabs.list, [
          view(tabs.tab(true, false), [text(tabs.label(true), 'Overview')]),
          view(tabs.tab(false, false), [text(tabs.label(false), 'Settings')]),
        ]),
        view(tabs.panel, [text(R.textRecipe({ size: 'sm' }, t), 'Panel content')]),
      ]),
    },
  ]);
  add('Feedback', [
    ...['info', 'success', 'warning', 'error'].map((variant) => {
      const r = R.alertRecipe({ variant }, t);
      return {
        label: `alert ${variant}`,
        node: view(r.container, [
          text(r.title, variant[0].toUpperCase() + variant.slice(1)),
          text(r.body, 'Something worth knowing.'),
        ]),
      };
    }),
    (() => {
      const r = R.toastRecipe({ variant: 'success' }, t);
      return {
        label: 'toast',
        node: view(r.container, [view({ flex: 1 }, [text(r.title, 'Saved'), text(r.body, 'All changes are stored.')])]),
      };
    })(),
  ]);
  const pr = R.progressRecipe({ value: 60 }, t);
  const sk = R.skeletonRecipe({ width: 160 }, t);
  const sp = R.spinnerRecipe({ size: 'md' }, t);
  add('Progress & Loading', [
    { label: 'progress 60%', node: view(pr.track, [view(pr.bar)]) },
    { label: 'skeleton', node: view(sk.block) },
    {
      label: 'spinner',
      node: view({
        width: 24,
        height: 24,
        borderRadius: 9999,
        borderWidth: 3,
        borderColor: sp.color,
        borderTopColor: 'transparent',
      }),
    },
  ]);
  const md = R.modalRecipe({ visible: true }, t);
  add('Modal', [
    {
      label: 'panel',
      node: view(md.panel, [
        text(md.title, 'Delete this item?'),
        text(R.textRecipe({ size: 'sm' }, t), 'This cannot be undone.'),
      ]),
    },
  ]);
  return { background: t.colors.background, foreground: t.colors.foreground, groups };
}

// --- the server --------------------------------------------------------------------------------------------------------

const MAX_BODY = 1024 * 1024;

function start({ designDir, outputRoot, port = 0, out = (s) => process.stdout.write(s + '\n') }) {
  const token = crypto.randomBytes(24).toString('hex');
  const ws = new Workspace({ designDir, outputRoot });
  const contract = loadContract();
  const page = fs.readFileSync(PAGE, 'utf8');
  const stateOf = () => ({ ...ws.state(), previewAvailable: !!contract });

  const json = (res, code, body) => {
    const s = JSON.stringify(body);
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(s);
  };

  const server = http.createServer((req, res) => {
    const addr = server.address();
    const host = String(req.headers.host || '');
    if (host !== `127.0.0.1:${addr.port}` && host !== `localhost:${addr.port}`)
      return json(res, 403, { error: 'forbidden host' });
    const url = new URL(req.url, `http://${host}`);
    if (req.method === 'GET' && url.pathname === '/') {
      if (url.searchParams.get('t') !== token) return json(res, 403, { error: 'missing or wrong token' });
      res.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'content-security-policy':
          "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'",
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'no-referrer',
      });
      return res.end(page.replace('__TOKEN__', token));
    }
    if (req.headers['x-flipova-token'] !== token) return json(res, 403, { error: 'missing or wrong token' });
    const body = () =>
      new Promise((resolve, reject) => {
        let size = 0;
        const parts = [];
        req.on('data', (c) => {
          size += c.length;
          if (size > MAX_BODY) {
            reject(new Error('request too large'));
            req.destroy();
          } else parts.push(c);
        });
        req.on('end', () => {
          try {
            resolve(parts.length ? JSON.parse(Buffer.concat(parts).toString('utf8')) : {});
          } catch {
            reject(new Error('invalid JSON'));
          }
        });
      });
    (async () => {
      if (req.method === 'GET' && url.pathname === '/api/state') return json(res, 200, stateOf());
      if (req.method === 'GET' && url.pathname === '/api/preview') {
        if (!contract)
          return json(res, 200, {
            available: false,
            reason:
              'The preview uses the published components (dist/). Run `npm run build` in the package, or install the published package.',
          });
        const { registry, error } = ws.registry();
        if (error) return json(res, 200, { available: false, reason: error });
        const id = url.searchParams.get('theme');
        if (!registry.themes[id]) return json(res, 404, { error: `unknown theme "${id}"` });
        return json(res, 200, { available: true, ...specimens(contract, registry, id) });
      }
      if (req.method === 'POST' && url.pathname === '/api/edit') {
        if (!String(req.headers['content-type'] || '').startsWith('application/json'))
          return json(res, 415, { error: 'JSON only' });
        const op = await body();
        try {
          ws.apply(op);
        } catch (e) {
          return json(res, 400, { error: String(e.message || e) });
        }
        return json(res, 200, stateOf());
      }
      if (req.method === 'POST' && url.pathname === '/api/validate') return json(res, 200, ws.validate());
      if (req.method === 'POST' && url.pathname === '/api/save') return json(res, 200, ws.save());
      return json(res, 404, { error: 'not found' });
    })().catch((e) => json(res, 400, { error: String(e.message || e) }));
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const p = server.address().port;
      const link = `http://127.0.0.1:${p}/?t=${token}`;
      out(`flipova-design gui  ${link}`);
      out(`editing ${designDir}  (changes stay in a working copy until you press Save)`);
      resolve({
        url: link,
        port: p,
        token,
        server,
        workspace: ws,
        close: () => new Promise((r) => server.close(() => (ws.dispose(), r()))),
      });
    });
  });
}

module.exports = { start, Workspace, paletteFrom, specimens, SCALES };
