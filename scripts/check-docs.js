#!/usr/bin/env node
/**
 * Docs <-> code guard of @flipova/foundation (zero dependencies).
 *
 * The documentation (README.md, DOCS.md and the public documents under documentation/) states facts that the code
 * decides. This check reads those statements and compares them with the source, so a doc that drifts fails CI:
 *
 *   placeholder      a `[?...]` fill-in zone left in documentation/ (a draft must not be published).
 *   provider-prop    an attribute written on <FlipovaProvider> that is not a prop of FlipovaProviderProps.
 *   provider-undoc   a prop of FlipovaProviderProps the reference document does not mention.
 *   cli-command      `flipova-design <x>` where x is not a command of the CLI.
 *   cli-undoc        a CLI command the reference document does not mention.
 *   npm-script       `npm run <x>` where x is not a script of package.json.
 *   import-path      `@flipova/foundation/<sub>` that package.json "exports" does not declare.
 *   export-undoc     a package.json export the reference document does not list.
 *   named-import     `import { A } from '@flipova/foundation'` where A is not exported by the package root.
 *   count            "N components/composants" or "N roles/rôles" with a number the code does not produce.
 *   link             a relative markdown link to a file that does not exist.
 *
 * Exit code 1 and one line per violation: `file  rule  message`.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const rel = (root, f) => path.relative(root, f).split(path.sep).join('/');
const read = (f) => fs.readFileSync(f, 'utf8');

function markdownFiles(root) {
  const out = [];
  for (const f of ['README.md', 'DOCS.md']) if (fs.existsSync(path.join(root, f))) out.push(path.join(root, f));
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md')) out.push(p);
    }
  };
  walk(path.join(root, 'documentation'));
  return out;
}

/** Props of FlipovaProviderProps, read from the source. */
function providerProps(root) {
  const src = read(path.join(root, 'components/providers/provider.tsx'));
  const m = /export interface FlipovaProviderProps \{([\s\S]*?)\n\}/.exec(src);
  if (!m) throw new Error('FlipovaProviderProps not found in components/providers/provider.tsx');
  return [...m[1].matchAll(/^ {2}(\w+)\??:/gm)].map((x) => x[1]);
}

/** Commands of the CLI, read from its own "Available:" message. */
function cliCommands(root) {
  const r = spawnSync(process.execPath, [path.join(root, 'design/tools/cli.js'), '__unknown__'], { encoding: 'utf8' });
  const m = /Available: (.+)/.exec(r.stderr || '');
  if (!m) throw new Error('cannot read the command list of design/tools/cli.js');
  return m[1].split(',').map((s) => s.trim());
}

/** Names exported by a module, following `export *` and `export { } from` on relative paths. */
function exportedNames(file, seen = new Set()) {
  const resolved = [file, `${file}.ts`, `${file}.tsx`, path.join(file, 'index.ts'), path.join(file, 'index.tsx')].find(
    (c) => fs.existsSync(c) && fs.statSync(c).isFile(),
  );
  if (!resolved || seen.has(resolved)) return new Set();
  seen.add(resolved);
  const src = read(resolved);
  const names = new Set();
  for (const m of src.matchAll(/^export\s+(?:declare\s+)?(?:const|let|function|class|enum)\s+(\w+)/gm)) names.add(m[1]);
  for (const m of src.matchAll(/^export\s+(?:type|interface)\s+(\w+)/gm)) names.add(m[1]);
  for (const m of src.matchAll(/^export\s+(?:type\s+)?\{([^}]*)\}(?:\s*from\s*'([^']+)')?/gm)) {
    for (const part of m[1].split(',')) {
      const name = part
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)
        .pop();
      if (name) names.add(name);
    }
  }
  for (const m of src.matchAll(/^export\s+\*\s+from\s+'([^']+)'/gm)) {
    if (m[1].startsWith('.'))
      for (const n of exportedNames(path.resolve(path.dirname(resolved), m[1]), seen)) names.add(n);
  }
  return names;
}

function check(root) {
  const v = [];
  const add = (file, rule, message) => v.push({ file: rel(root, file), rule, message });
  const pkg = JSON.parse(read(path.join(root, 'package.json')));
  const props = providerProps(root);
  const commands = cliCommands(root);
  const scripts = new Set(Object.keys(pkg.scripts || {}));
  const exportKeys = Object.keys(pkg.exports || {});
  const rootNames = exportedNames(path.join(root, 'index.ts'));

  const table = fs.existsSync(path.join(root, 'COMPONENTS.md')) ? read(path.join(root, 'COMPONENTS.md')) : '';
  const total = (/\*\*(\d+)\*\* components/.exec(table) || [])[1];
  const allowedCounts = new Set(
    [...table.matchAll(/^\| (?:flipova|gluestack|reusables|paper|tamagui) \| (\d+) \| (\d+) \| (\d+) \| (\d+) \|/gm)]
      .flatMap((m) => m.slice(1))
      .concat(total ? [total] : []),
  );
  const themeSrc = read(path.join(root, 'components/contract/theme.ts'));
  const roles = /export const REQUIRED_ROLES = \[([\s\S]*?)\] as const/.exec(themeSrc);
  const rolesCount = roles ? (roles[1].match(/'[^']+'/g) || []).length : null;

  const files = markdownFiles(root);
  const reference = files.filter((f) => /documentation\/.*FLP-REF/.test(rel(root, f)) || /FLP-REF/.test(f));
  const refText = reference.map(read).join('\n');

  for (const file of files) {
    const text = read(file);
    const isPublic = rel(root, file).startsWith('documentation/');
    if (isPublic && /\[\?/.test(text)) add(file, 'placeholder', 'a [?...] zone is still to fill');

    for (const m of text.matchAll(/<FlipovaProvider\b([^>]*)>/g)) {
      for (const a of m[1].matchAll(/(?:^|\s)([A-Za-z][\w-]*)=/g)) {
        if (!props.includes(a[1]))
          add(file, 'provider-prop', `<FlipovaProvider ${a[1]}=…> is not a prop (${props.join(', ')})`);
      }
    }
    for (const m of text.matchAll(/flipova-design\s+([a-z][\w-]*)/g)) {
      if (!commands.includes(m[1]))
        add(file, 'cli-command', `flipova-design ${m[1]} is not a command (${commands.join(', ')})`);
    }
    for (const m of text.matchAll(/npm run ([\w:.-]+)/g)) {
      if (!scripts.has(m[1])) add(file, 'npm-script', `npm run ${m[1]} is not a script of package.json`);
    }
    for (const m of text.matchAll(/@flipova\/foundation((?:\/[A-Za-z0-9_-]+)+)/g)) {
      if (!exportKeys.includes(`.${m[1]}`))
        add(file, 'import-path', `@flipova/foundation${m[1]} is not in package.json exports`);
    }
    for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*'@flipova\/foundation(?:\/ui)?'/g)) {
      for (const part of m[1].split(',')) {
        const name = part
          .trim()
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0];
        if (name && !rootNames.has(name)) add(file, 'named-import', `${name} is not exported by @flipova/foundation`);
      }
    }
    for (const m of text.matchAll(/\b(\d+)\s+(?:composants|components)\b/g)) {
      if (allowedCounts.size && !allowedCounts.has(m[1]))
        add(file, 'count', `“${m[0]}”: the code has ${[...allowedCounts].join('/')}`);
    }
    for (const m of text.matchAll(/\b(\d+)\s+(?:rôles|roles|colour roles|required colour roles)\b/g)) {
      if (rolesCount !== null && Number(m[1]) !== rolesCount)
        add(file, 'count', `“${m[0]}”: REQUIRED_ROLES has ${rolesCount}`);
    }
    for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const target = m[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target) || target.startsWith('/')) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), target))) add(file, 'link', `${m[1]} does not exist`);
    }
  }

  if (reference.length) {
    const refFile = reference[0];
    for (const p of props)
      if (p !== 'children' && !refText.includes(`\`${p}\``))
        add(refFile, 'provider-undoc', `prop ${p} is not documented`);
    for (const c of commands)
      if (!refText.includes(`\`${c}\``)) add(refFile, 'cli-undoc', `command ${c} is not documented`);
    for (const k of exportKeys) {
      const spec = k === '.' ? '@flipova/foundation' : `@flipova/foundation${k.slice(1)}`;
      if (!refText.includes(`\`${spec}\``)) add(refFile, 'export-undoc', `export ${spec} is not documented`);
    }
  }
  return v;
}

module.exports = { check, providerProps, cliCommands, exportedNames };

if (require.main === module) {
  const violations = check(path.resolve(__dirname, '..'));
  for (const x of violations) process.stdout.write(`${x.file}  ${x.rule}  ${x.message}\n`);
  if (violations.length) {
    process.stdout.write(`\n${violations.length} doc/code mismatch(es).\n`);
    process.exitCode = 1;
  } else process.stdout.write('docs: consistent with the code.\n');
}
