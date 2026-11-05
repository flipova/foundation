'use strict';

/** Python's repr() of a string / list of strings, so diagnostics read the same as before. */
function pyRepr(v) {
  if (Array.isArray(v)) return `[${v.map(pyRepr).join(', ')}]`;
  if (v === null || v === undefined) return 'None';
  const s = String(v);
  const q = s.includes("'") && !s.includes('"') ? '"' : "'";
  let out = '';
  for (const ch of s) {
    if (ch === '\\') out += '\\\\';
    else if (ch === q) out += `\\${q}`;
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else if (ch.codePointAt(0) < 32 || ch.codePointAt(0) === 127)
      out += `\\x${ch.codePointAt(0).toString(16).padStart(2, '0')}`;
    else out += ch;
  }
  return q + out + q;
}

/** Locale-independent natural sort key: digits compare as numbers, the rest case-folded. */
function naturalKey(value) {
  return String(value)
    .split(/(\d+)/)
    .filter((p) => p !== '')
    .map((p) => (/^\d+$/.test(p) ? [0, BigInt(p), ''] : [1, 0n, p.toLowerCase()]));
}

function compareKeys(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i][0] !== b[i][0]) return a[i][0] < b[i][0] ? -1 : 1;
    if (a[i][1] !== b[i][1]) return a[i][1] < b[i][1] ? -1 : 1;
    if (a[i][2] !== b[i][2]) return a[i][2] < b[i][2] ? -1 : 1;
  }
  return a.length === b.length ? 0 : a.length < b.length ? -1 : 1;
}

const sortNatural = (list) => [...list].sort((x, y) => compareKeys(naturalKey(x), naturalKey(y)));

/** Comma-separated parameter -> trimmed non-empty parts. */
const splitList = (raw) =>
  String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** Full-match of a Python-style pattern. */
const fullMatch = (pattern) => new RegExp(`^(?:${pattern})$`);

module.exports = { pyRepr, naturalKey, compareKeys, sortNatural, splitList, fullMatch };
