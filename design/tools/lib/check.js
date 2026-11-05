'use strict';
/**
 * Manifest-driven determinism checker. Rules are declared in manifest.xml (`meta/determinism/rule`), each with a
 * `kind`; one handler per kind enforces them. Also emits / verifies the canonical index and syncs `@schema`.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { parseFile, XmlError } = require('./xml');
const { NS, at, buildModel, resolveReference, resolveReferenceValue } = require('./registry');
const { pyRepr, naturalKey, compareKeys, sortNatural, fullMatch } = require('./util');

const IGNORE_DIRS = new Set([
  '.git',
  '.svn',
  '.hg',
  'node_modules',
  '.venv',
  '__pycache__',
  '.DS_Store',
  'dist',
  'build',
  'docs',
  'generated',
]);

// --- files -----------------------------------------------------------------------------------------------------

const globToRegex = (glob) =>
  new RegExp(
    `^${glob
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*\/?/g, '\u0000')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '[^/]')
      .replace(/\u0000/g, '(?:.*/)?')}$`,
  );

function* iterFiles(root, pattern) {
  const pat = pattern.replace(/\\/g, '/');
  const nameOnly = !pat.includes('/') && pat.includes('*');
  const re = globToRegex(pat);
  function* walk(dir, rel) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory() && !IGNORE_DIRS.has(e.name))
      .map((e) => e.name)
      .sort();
    const files = entries
      .filter((e) => !e.isDirectory())
      .map((e) => e.name)
      .sort();
    for (const name of files) {
      const r = rel ? `${rel}/${name}` : name;
      if (nameOnly ? re.test(name) : re.test(r)) yield path.join(dir, name);
    }
    for (const d of dirs) yield* walk(path.join(dir, d), rel ? `${rel}/${d}` : d);
  }
  yield* walk(root, '');
}

const byParts = (a, b) => {
  const x = a.split(path.sep);
  const y = b.split(path.sep);
  for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] < y[i] ? -1 : 1;
  return x.length - y.length;
};

function expandTargets(root, pattern) {
  if (!pattern) return [];
  const pat = pattern.replace(/\\/g, '/');
  return [...new Set([...iterFiles(root, pat)].map((p) => path.resolve(p)))].sort(byParts);
}

// --- report ----------------------------------------------------------------------------------------------------

class Report {
  constructor() {
    this.diagnostics = [];
  }

  add(rule, file, line, message) {
    this.diagnostics.push({ ruleId: rule.id, severity: rule.severity, file, line, message });
  }

  get errors() {
    return this.diagnostics.filter((d) => d.severity === 'error');
  }

  get warnings() {
    return this.diagnostics.filter((d) => d.severity === 'warning');
  }
}

const format = (d) =>
  `[${d.severity.toUpperCase()}] ${d.file}${d.line !== null && d.line !== undefined ? `:${d.line}` : ''} [rule=${d.ruleId}]: ${d.message}`;

// --- handlers --------------------------------------------------------------------------------------------------

const NON_ASCII = /[^\x00-\x7F]/;
const TIMESTAMP =
  /\b\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2})?(?:Zz|[+-]\d{2}:?\d{2})?|\b\d{4}-\d{2}-\d{2}\b|\b1[5-9]\d{8}\b/;

function identOf(el, name) {
  let ident = el.get('id');
  if (ident === null) ident = el.get('register') || el.get('name');
  if (ident === null && ['item', 'field', 'key', 'register'].includes(name)) ident = (el.text || '').trim();
  return ident;
}

function checkRegisterOrder(ctx, rule, report) {
  const canonical = ctx.registers;
  const mroot = parseFile(ctx.manifestPath);
  const catalogs = at(mroot, 'catalogs', 'catalog').map((c) => c.get('register'));
  const indexRegs = at(mroot, 'index', 'register').map((r) => r.get('name'));
  for (const [label, got] of [
    ['catalogs', catalogs],
    ['index', indexRegs],
  ]) {
    if (got.length !== canonical.length || got.some((g, i) => g !== canonical[i])) {
      report.add(
        rule,
        ctx.manifestPath,
        null,
        `${label} register order ${pyRepr(got)} != canonical ${pyRepr(canonical)} (canonical sort by (register, id) requires one order everywhere)`,
      );
    }
  }
  for (const catalog of at(mroot, 'catalogs', 'catalog')) {
    const declared = catalog.get('register');
    const f = catalog.find('file', NS);
    if (!f || !f.text) continue;
    const file = path.resolve(path.dirname(ctx.manifestPath), f.text.trim());
    if (!fs.existsSync(file)) continue;
    let actual;
    try {
      actual = parseFile(file).get('register');
    } catch (e) {
      if (e instanceof XmlError) continue;
      throw e;
    }
    if (actual !== declared)
      report.add(
        rule,
        file,
        null,
        `file declares register=${pyRepr(actual)} but the catalog expects ${pyRepr(declared)}`,
      );
  }
}

function checkSiblingOrder(file, rule, selectors, report) {
  const set = new Set(selectors);
  const root = parseFile(file);
  for (const parent of root.iter()) {
    const last = new Map();
    for (const child of parent.children) {
      if (set.size && !set.has(child.name)) continue;
      let ident = child.get('id') || child.get('name') || child.get('register');
      if (ident === null && ['item', 'field', 'key', 'register'].includes(child.name))
        ident = (child.text || '').trim();
      if (!ident) continue;
      const key = naturalKey(ident);
      if (last.has(child.name) && compareKeys(key, last.get(child.name)) < 0) {
        report.add(
          rule,
          file,
          child.line,
          `${child.name} ${pyRepr(ident)} out of canonical order (expected non-decreasing natural sort by id/name)`,
        );
      }
      last.set(child.name, key);
    }
  }
}

const HANDLERS = {
  ids(ctx, rule, targets, report) {
    const pattern = rule.get('pattern') || '^[A-Za-z][A-Za-z0-9]*$';
    const selectors = new Set(rule.getList('selectors', ['token', 'theme', 'role', 'item', 'register']));
    const re = fullMatch(pattern);
    for (const file of targets) {
      for (const el of parseFile(file).iter()) {
        if (!selectors.has(el.name)) continue;
        const ident = identOf(el, el.name);
        if (!ident) continue;
        if (!re.test(ident))
          report.add(
            rule,
            file,
            el.line,
            `id ${pyRepr(ident)} violates stable-slug pattern ${pyRepr(pattern)} (explicit uid, otherwise stable slug)`,
          );
        if (ctx.reserves.includes(ident))
          report.add(rule, file, el.line, `id ${pyRepr(ident)} is a reserved word (${ctx.reserves.join(', ')})`);
      }
    }
  },

  ordering(ctx, rule, targets, report) {
    const mode = rule.get('mode') || 'registers';
    if (mode === 'registers') checkRegisterOrder(ctx, rule, report);
    else if (mode === 'siblings')
      for (const file of targets) checkSiblingOrder(file, rule, rule.getList('selectors', []), report);
    else
      report.add(
        rule,
        path.basename(ctx.manifestPath),
        null,
        `unknown ordering mode ${pyRepr(mode)} (expected 'registers' or 'siblings')`,
      );
  },

  references(ctx, rule, targets, report) {
    const pattern = rule.get('pattern');
    const re = pattern ? fullMatch(pattern) : null;
    for (const file of targets) {
      for (const el of parseFile(file).iter()) {
        if (el.name !== 'ref') continue;
        const ref = (el.text || '').trim();
        if (!ref) continue;
        if (re && !re.test(ref))
          report.add(
            rule,
            file,
            el.line,
            `reference ${pyRepr(ref)} violates format pattern ${pyRepr(pattern)} (expected $ref.<register>.<id>.<path> or <id>.<path>)`,
          );
        if (!resolveReference(ctx, ref))
          report.add(
            rule,
            file,
            el.line,
            `dangling reference ${pyRepr(ref)}: no token value matches (never implicit links)`,
          );
      }
    }
  },

  timestamps(ctx, rule, targets, report) {
    for (const file of targets) {
      for (const el of parseFile(file).iter()) {
        const values = [];
        if (el.text && el.text.trim()) values.push(el.text);
        for (const a of el.attrs) if (a.value && a.value.trim()) values.push(a.value);
        for (const value of values) {
          const m = TIMESTAMP.exec(value);
          if (m)
            report.add(
              rule,
              file,
              el.line,
              `timestamp forbidden: found ${pyRepr(m[0])} (bit-identical rebuilds require no date/time literal)`,
            );
        }
      }
    }
  },

  locale(ctx, rule, targets, report) {
    const exemptTags = new Set(rule.getList('exemptTags', ['label', 'description', 'content']));
    const exemptSubtrees = new Set(rule.getList('exemptSubtrees', []));
    const exemptAttrs = new Set(rule.getList('exemptAttrs', ['title', 'description']));
    for (const file of targets) {
      for (const el of parseFile(file).iter()) {
        if (exemptTags.has(el.name)) continue;
        let inSubtree = false;
        for (let p = el.parent; p; p = p.parent)
          if (exemptSubtrees.has(p.name)) {
            inSubtree = true;
            break;
          }
        if (inSubtree) continue;
        const values = [];
        if (el.text && el.text.trim()) values.push(el.text);
        for (const a of el.attrs) {
          let v = a.value;
          if (!v || !v.trim()) continue;
          if (exemptAttrs.has(a.name)) continue;
          if (v.startsWith('static:')) v = 'static:';
          values.push(v);
        }
        for (const value of values) {
          const m = NON_ASCII.exec(value);
          if (m)
            report.add(
              rule,
              file,
              el.line,
              `locale forbidden in values: non-ASCII ${pyRepr(m[0])} in ${pyRepr(value.trim())} (allowed only in labels/comments)`,
            );
        }
      }
    }
  },

  sync(ctx, rule, targets, report) {
    for (const file of targets) {
      let root;
      try {
        root = parseFile(file);
      } catch (e) {
        if (e instanceof XmlError) {
          report.add(rule, file, e.line, `malformed XML: ${e.message}`);
          continue;
        }
        throw e;
      }
      const schema = root.get('schema');
      if (ctx.schemaId && schema !== null && schema !== ctx.schemaId) {
        report.add(
          rule,
          file,
          1,
          `root @schema ${pyRepr(schema)} != manifest @schema ${pyRepr(ctx.schemaId)} -- run \`flipova-design check --sync-version\``,
        );
      }
    }
  },
};

// --- canonical index ---------------------------------------------------------------------------------------------

function canonicalPayload(ctx) {
  const entries = [];
  for (const reg of sortNatural(ctx.registers)) {
    let ids;
    if (ctx.catalogFiles.has(reg) && fs.existsSync(ctx.catalogFiles.get(reg))) {
      if (reg === 'tokens') ids = sortNatural([...ctx.tokenValues.keys()]);
      else if (reg === 'themes') ids = sortNatural([...ctx.themeRoles.keys()]);
      else ids = sortNatural(ctx.index[reg] || []);
    } else ids = sortNatural(ctx.index[reg] || []);
    for (const id of ids) entries.push(`${reg}/${id}`);
  }
  const refs = new Map();
  for (const file of ctx.catalogFiles.values()) {
    if (!fs.existsSync(file)) continue;
    for (const el of parseFile(file).iter('ref', NS)) {
      const ref = (el.text || '').trim();
      if (ref && resolveReference(ctx, ref)) refs.set(ref, resolveReferenceValue(ctx, ref));
    }
  }
  return [entries, sortNatural([...refs.keys()]).map((r) => `${r} -> ${refs.get(r)}`)];
}

function canonicalDocument(ctx) {
  const [entries, refLines] = canonicalPayload(ctx);
  const digest = crypto.createHash('sha256').update(entries.join('\n'), 'utf8').digest('hex');
  const lines = [
    '# Flipova Foundation — canonical registry index (deterministic artifact)',
    '# generated by flipova-design canonical',
    '# commit this file: --verify-canonical fails the build when the registry drifts.',
    '',
    '# entries (register/id) — canonical sort by (register, id)',
    ...entries,
    '',
    '## references (resolved, never dangling)',
    ...refLines,
    '',
    '## sha256',
    digest,
  ];
  return `${lines.join('\n')}\n`;
}

/** The provenance comment names the tool that wrote the file: it is not part of what must match. */
const withoutProvenance = (text) =>
  text
    .split('\n')
    .filter((l) => !l.startsWith('# generated by'))
    .join('\n')
    .trim();

// --- @schema sync ------------------------------------------------------------------------------------------------

function rootStartTag(data) {
  let idx = 0;
  while (true) {
    idx = data.indexOf('<', idx);
    if (idx === -1) return null;
    const head = data.slice(idx, idx + 4);
    if (head.startsWith('<?')) idx = data.indexOf('?>', idx) + 1;
    else if (head.startsWith('<!--')) idx = data.indexOf('-->', idx) + 3;
    else if (head.startsWith('<!')) idx = data.indexOf('>', idx) + 1;
    else if (head.startsWith('</')) idx += 2;
    else return idx;
  }
}

/** Rewrites @schema on every root start tag to the manifest value. Returns the number of files changed. */
function syncVersions(ctx, out = console.log) {
  let count = 0;
  for (const file of expandTargets(ctx.root, '*.xml')) {
    let data;
    try {
      data = fs.readFileSync(file).toString('latin1'); // byte-transparent
    } catch {
      continue;
    }
    const start = rootStartTag(data);
    if (start === null) continue;
    const end = data.indexOf('>', start);
    if (end === -1) continue;
    const tag = data.slice(start, end);
    const id = Buffer.from(ctx.schemaId, 'utf8').toString('latin1');
    const next = ctx.schemaId ? tag.replace(/(\bschema=")[^"]*(")/, (m, a, b) => a + id + b) : tag;
    if (next !== tag) {
      fs.writeFileSync(file, Buffer.from(data.slice(0, start) + next + data.slice(end), 'latin1'));
      out(`  synced ${file}`);
      count++;
    }
  }
  return count;
}

// --- XSD pass ---------------------------------------------------------------------------------------------------

function validateXsd(ctx, schemaPath) {
  const { Schema, validateFile } = require('./xsd');
  const report = new Report();
  const schema = Schema.fromFile(schemaPath);
  for (const file of [ctx.manifestPath, ...ctx.catalogFiles.values()]) {
    for (const err of validateFile(schema, file).errors) {
      report.diagnostics.push({
        ruleId: 'xsd',
        severity: err.severity || 'error',
        file: err.file,
        line: err.line,
        message: err.message,
      });
    }
  }
  return report;
}

/** CLI: returns the exit code. */
function run(opts) {
  const {
    root,
    manifest,
    schema,
    check = true,
    listRules = false,
    emitCanonical = false,
    verifyCanonical = false,
    syncVersion = false,
    outFile = null,
    verbose = false,
    out = console.log,
  } = opts;
  const rootAbs = path.resolve(root);
  const manifestPath = path.resolve(manifest);
  let ctx;
  try {
    ctx = buildModel(rootAbs, manifestPath);
  } catch (e) {
    if (!(e instanceof XmlError)) throw e;
    out(`error: ${e.file ? `${e.file}:${e.line}: ` : ''}malformed XML: ${e.message}`);
    return 1;
  }

  if (listRules) {
    out(
      `Determinism rules declared in ${path.relative(rootAbs, manifestPath)} (handlers: ${Object.keys(HANDLERS).sort().join(', ')}):`,
    );
    for (const r of ctx.rules) {
      out(
        `  - ${r.id}  kind=${r.kind} severity=${r.severity} applyTo=${r.applyTo}  [${r.kind in HANDLERS ? 'registered' : 'NO HANDLER (warning)'}]`,
      );
      out(`      ${r.description}`);
    }
    return 0;
  }

  const report = new Report();
  if (schema) report.diagnostics.push(...validateXsd(ctx, path.resolve(schema)).diagnostics);
  if (check) {
    for (const rule of ctx.rules) {
      if (!(rule.kind in HANDLERS)) {
        report.add(
          rule,
          path.basename(manifestPath),
          null,
          `no handler registered for kind=${pyRepr(rule.kind)}; rule declared but not enforced yet`,
        );
        continue;
      }
      const targets = expandTargets(rootAbs, rule.applyTo);
      try {
        HANDLERS[rule.kind](ctx, rule, targets, report);
      } catch (e) {
        if (!(e instanceof XmlError)) throw e;
        report.add(rule, e.file || path.basename(manifestPath), e.line, `malformed XML: ${e.message}`);
      }
      if (verbose)
        out(
          `rule ${rule.id} [${rule.kind}]: ${targets.length} file(s), ${report.diagnostics.filter((d) => d.ruleId === rule.id).length} diagnostic(s)`,
        );
    }
  }
  const canonicalPath = outFile ? path.resolve(outFile) : path.join(rootAbs, 'design', 'canonical.index.txt');
  if (emitCanonical) {
    fs.mkdirSync(path.dirname(canonicalPath), { recursive: true });
    fs.writeFileSync(canonicalPath, canonicalDocument(ctx), 'utf8');
    out(`canonical index written to ${canonicalPath}`);
  }
  if (verifyCanonical) {
    const fail = (m) =>
      report.diagnostics.push({ ruleId: 'canonical', severity: 'error', file: canonicalPath, line: null, message: m });
    if (!fs.existsSync(canonicalPath)) fail('canonical index file missing; run `flipova-design canonical`');
    else if (withoutProvenance(fs.readFileSync(canonicalPath, 'utf8')) !== withoutProvenance(canonicalDocument(ctx)))
      fail('canonical index drifted from the registry; run `flipova-design canonical` and commit the new file');
  }
  if (syncVersion)
    out(
      `sync-version: ${syncVersions(ctx, out)} file(s) updated (version=${pyRepr(ctx.version)} schema=${pyRepr(ctx.schemaId)})`,
    );
  for (const d of report.diagnostics) out(`  ${format(d)}`);
  out(`checker: ${report.errors.length} error(s), ${report.warnings.length} warning(s)`);
  return report.errors.length ? 1 : 0;
}

module.exports = {
  HANDLERS,
  Report,
  expandTargets,
  canonicalDocument,
  canonicalPayload,
  syncVersions,
  validateXsd,
  run,
  format,
};
