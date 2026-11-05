#!/usr/bin/env node
/**
 * Boundary check of @flipova/foundation (zero dependencies).
 *
 * Foundation is the bottom of the stack: primitives + the design (tokens, themes, contract, providers). Layouts,
 * sections, auth screens, mockups and effects belong to the frontend package, and nothing here may depend on a
 * higher layer. Three families of rules, all derived from the imports found in the source:
 *
 *   1. no-upward   no import of another @flipova/* package (frontend, accounts, app, ...) -- foundation depends on none.
 *   2. layers      inside components/: theme <- contract <- providers (core, then one folder per library); ui (the
 *                  unified components) sits on top and may reach only the flipova provider, its fallback.
 *   4. flipova-pure the flipova provider imports nothing but react and react-native.
 *   3. optional    a provider library (react-native-paper, @tamagui/core, @rn-primitives/*) is imported only by its own
 *                  provider folder, so the core entries never pull an optional peer.
 *
 * It also refuses folders under components/ that are frontend material (layouts, sections, auth, mockups, effects...).
 * Exit code 1 and one line per violation: `file:line  rule  message`.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const SOURCE = /\.(?:[cm]?[jt]sx?)$/;
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git']);
const FRONTEND_DIRS = [
  'layouts',
  'layout',
  'sections',
  'section',
  'auth',
  'mockups',
  'mockup',
  'effects',
  'effect',
  'screens',
  'pages',
  'templates',
];

/** layer of a file, from its path relative to the repo root */
function layerOf(rel) {
  const p = rel.split(path.sep).join('/');
  let m;
  if (p.startsWith('components/theme/')) return { layer: 'theme' };
  if (p.startsWith('components/contract/')) return { layer: 'contract' };
  if ((m = /^components\/providers\/(flipova|gluestack|paper|tamagui|reusables)\//.exec(p)))
    return { layer: 'provider', lib: m[1] };
  if (p.startsWith('components/providers/')) return { layer: 'providers-core' };
  if (p.startsWith('components/ui/')) return { layer: 'ui' };
  return { layer: 'root' };
}

/**
 * which layers a layer may import (relative imports are resolved to a layer; packages are handled separately):
 *   theme < contract < providers-core < provider/<lib> ; ui (the unified components) sits on top of providers-core and
 *   of the flipova provider only, since flipova is what it falls back to.
 */
const MAY_IMPORT = {
  theme: new Set(['theme']),
  contract: new Set(['contract', 'theme']),
  'providers-core': new Set(['providers-core', 'contract', 'theme']),
  provider: new Set(['provider', 'providers-core', 'contract', 'theme']),
  ui: new Set(['ui', 'providers-core', 'provider', 'contract', 'theme']),
  root: new Set(['root', 'theme', 'contract', 'providers-core', 'provider', 'ui']),
};

/** the only bare packages the flipova provider may import: it is built from React and React Native alone */
const FLIPOVA_ALLOWED = /^(react|react-native)$/;

/** packages only one provider folder may import */
const OPTIONAL = [
  { test: (n) => n === 'react-native-paper' || n.startsWith('react-native-paper/'), lib: 'paper' },
  { test: (n) => n === '@tamagui/core' || n.startsWith('@tamagui/'), lib: 'tamagui' },
  { test: (n) => n.startsWith('@rn-primitives/'), lib: 'reusables' },
];

/** comments are not imports: drop block comments and whole-line `//` comments (line numbers are kept) */
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/^[ \t]*\/\/.*$/gm, '');

function importsOf(raw) {
  const text = stripComments(raw);
  const out = [];
  const re =
    /(?:^|[^\w$.])(?:import|export)\s+(?:type\s+)?(?:[^'"`;]*?\sfrom\s*)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)|\brequire\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = re.exec(text)))
    out.push({
      spec: m[1] || m[2] || m[3],
      line: text.slice(0, m.index + (m[0].startsWith('\n') ? 1 : 0)).split('\n').length,
    });
  return out;
}

function* walk(dir, root) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full, root);
    else if (SOURCE.test(e.name)) yield path.relative(root, full);
  }
}

function check(root) {
  const violations = [];
  const add = (file, line, rule, message) => violations.push({ file, line, rule, message });

  const comps = path.join(root, 'components');
  if (fs.existsSync(comps))
    for (const e of fs.readdirSync(comps, { withFileTypes: true }))
      if (e.isDirectory() && FRONTEND_DIRS.includes(e.name.toLowerCase()))
        add(
          `components/${e.name}`,
          0,
          'frontend-material',
          `"${e.name}" belongs to the frontend package, not to foundation`,
        );

  const roots = ['components', 'index.ts'].filter((p) => fs.existsSync(path.join(root, p)));
  const files = [];
  for (const r of roots) {
    const full = path.join(root, r);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full, root));
    else files.push(r);
  }

  for (const rel of files.sort()) {
    const me = layerOf(rel);
    const isTest = /\.test\.[cm]?[jt]sx?$/.test(rel);
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    for (const { spec, line } of importsOf(text)) {
      if (/^@flipova\//.test(spec) && !/^@flipova\/foundation(\/|$)/.test(spec))
        add(rel, line, 'no-upward', `imports ${spec}: foundation depends on no other @flipova package`);
      if (/^@flipova\/foundation(\/|$)/.test(spec))
        add(rel, line, 'self-import', `imports itself by package name (${spec}); use a relative path`);

      if (spec.startsWith('.')) {
        const target = path.relative(root, path.resolve(root, path.dirname(rel), spec));
        if (target.startsWith('..')) {
          add(rel, line, 'outside-package', `${spec} leaves the package`);
          continue;
        }
        const them = layerOf(target + '/');
        if (!isTest && !MAY_IMPORT[me.layer].has(them.layer))
          add(rel, line, 'layers', `${me.layer} may not import ${them.layer} (${spec})`);
        if (them.layer === 'provider' && me.layer === 'provider' && them.lib !== me.lib)
          add(rel, line, 'layers', `provider "${me.lib}" imports provider "${them.lib}" (${spec})`);
        if (!isTest && me.layer === 'ui' && them.layer === 'provider' && them.lib !== 'flipova')
          add(
            rel,
            line,
            'layers',
            `ui may import only the flipova provider (its fallback), not "${them.lib}" (${spec})`,
          );
        continue;
      }
      if (me.layer === 'provider' && me.lib === 'flipova' && !isTest && !FLIPOVA_ALLOWED.test(spec))
        add(rel, line, 'flipova-pure', `${spec}: the flipova provider is built from react and react-native only`);
      for (const o of OPTIONAL)
        if (o.test(spec)) {
          const allowed = (me.layer === 'provider' && me.lib === o.lib) || isTest;
          if (!allowed)
            add(
              rel,
              line,
              'optional-peer',
              `${spec} is an optional peer of providers/${o.lib}; no other file may import it`,
            );
        }
    }
  }
  return violations;
}

module.exports = { check, importsOf, layerOf, FRONTEND_DIRS };

if (require.main === module) {
  const root = path.resolve(process.argv[2] || process.cwd());
  const v = check(root);
  for (const x of v) console.log(`${x.file}:${x.line}  ${x.rule}  ${x.message}`);
  console.log(v.length ? `\n${v.length} boundary violation(s)` : 'boundary: ok');
  process.exit(v.length ? 1 : 0);
}
