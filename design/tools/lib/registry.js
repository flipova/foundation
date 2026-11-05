'use strict';
/** Registry model: what the manifest declares and what the catalogs hold (tokens, theme roles, rules). */
const fs = require('fs');
const path = require('path');
const { parseFile } = require('./xml');

const NS = 'urn:flipova:foundation:registry';

/** Elements at <path...> below `el` (each step is a direct-child name in the registry namespace). */
function at(el, ...steps) {
  let level = [el];
  for (const s of steps) level = level.flatMap((e) => e.findAll(s, NS));
  return level;
}

class Rule {
  constructor({ id, kind, severity, description, applyTo, params }) {
    Object.assign(this, { id, kind, severity, description, applyTo, params });
  }

  get(name, def = null) {
    return name in this.params ? this.params[name] : def;
  }

  getList(name, def = []) {
    const raw = this.params[name];
    if (raw === undefined) return [...def];
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

function parseRules(manifest) {
  return at(manifest, 'meta', 'determinism', 'rule').map((r) => {
    const params = {};
    for (const p of at(r, 'params', 'param')) params[p.get('name')] = p.text.trim();
    const applyTo = r.findText('applyTo', NS);
    return new Rule({
      id: r.get('id'),
      kind: r.get('kind'),
      severity: r.get('severity') || 'error',
      description: (r.findText('description', NS) || '').trim(),
      applyTo: applyTo ? applyTo.trim() : '*.xml',
      params,
    });
  });
}

/** manifest.xml -> everything the checker and the generator reason about. */
function buildModel(root, manifestPath) {
  const manifest = path.resolve(manifestPath);
  const manifestDir = path.dirname(manifest);
  const mroot = parseFile(manifest);
  const registers = at(mroot, 'index', 'register').map((r) => (r.get('name') || '').trim());
  const index = {};
  for (const r of at(mroot, 'index', 'register')) index[r.get('name')] = at(r, 'item').map((i) => i.text.trim());

  const catalogFiles = new Map();
  for (const c of at(mroot, 'catalogs', 'catalog')) {
    const f = c.find('file', NS);
    if (f && f.text) catalogFiles.set(c.get('register'), path.resolve(manifestDir, f.text.trim()));
  }

  const tokenValues = new Map(); // token id -> Map(value id -> literal)
  const themeRoles = new Map(); // theme id -> Map(role id -> ref)
  for (const file of catalogFiles.values()) {
    if (!fs.existsSync(file)) continue;
    const doc = parseFile(file);
    for (const token of doc.iter('token', NS)) {
      const values = new Map();
      for (const v of token.iter('value', NS)) values.set(v.get('id'), v.text.trim());
      tokenValues.set(token.get('id'), values);
    }
    for (const theme of doc.iter('theme', NS)) {
      const roles = new Map();
      for (const role of theme.iter('role', NS)) {
        const ref = role.find('ref', NS);
        roles.set(role.get('id'), ref ? ref.text.trim() : '');
      }
      themeRoles.set(theme.get('id'), roles);
    }
  }

  let version = '';
  const pkg = path.join(root, 'package.json');
  if (fs.existsSync(pkg)) {
    try {
      version = JSON.parse(fs.readFileSync(pkg, 'utf8')).version || '';
    } catch {
      version = '';
    }
  }
  return {
    root: path.resolve(root),
    manifestPath: manifest,
    registers,
    reserves: [],
    index,
    catalogFiles,
    tokenValues,
    themeRoles,
    rules: parseRules(mroot),
    version,
    schemaId: mroot.get('schema') || '',
  };
}

/** True when `ref` resolves against the registry (never implicit links). */
function resolveReference(ctx, ref) {
  let parts = ref.startsWith('$ref.') ? ref.slice(5).split('.') : ref.split('.');
  if (parts.length && ctx.registers.includes(parts[0])) parts = parts.slice(1);
  if (!parts.length) return false;
  const [itemId, ...rest] = parts;
  const key = rest.join('.');
  if (ctx.tokenValues.has(itemId)) return rest.length ? ctx.tokenValues.get(itemId).has(key) : true;
  if (ctx.themeRoles.has(itemId)) return rest.length ? ctx.themeRoles.get(itemId).has(key) : true;
  return false;
}

function resolveReferenceValue(ctx, ref) {
  let parts = ref.startsWith('$ref.') ? ref.slice(5).split('.') : ref.split('.');
  if (parts.length && ctx.registers.includes(parts[0])) parts = parts.slice(1);
  const [itemId, ...rest] = parts;
  if (ctx.tokenValues.has(itemId)) {
    const v = ctx.tokenValues.get(itemId).get(rest.join('.'));
    return v === undefined ? '?' : v;
  }
  return '?';
}

class SystemExit extends Error {}

module.exports = { NS, at, Rule, buildModel, resolveReference, resolveReferenceValue, SystemExit };
