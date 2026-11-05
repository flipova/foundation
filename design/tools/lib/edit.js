'use strict';
/**
 * Text-level edits of the registries, used by the GUI. They change only what is asked and leave every comment, blank
 * line and indentation of the file alone, so a visual edit produces the diff a careful hand edit would.
 * Every function takes the XML text and returns the new text, or throws an Error with a message fit for the user.
 */
const ID = /^[A-Za-z][A-Za-z0-9-]*$/; // theme ids, role ids (the manifest's ids.stable-slug rule)
const VALUE_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/; // token value ids: 50, primary.600, 2xl, hard-1
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const REF = /^\$ref\.[a-z][a-z0-9]*\.[A-Za-z0-9_.-]+$/;
const NUMBER = /^-?\d+(?:\.\d+)?$/;
const MODES = ['light', 'dark'];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const xmlEsc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** [start, end) of the element `<tag ... id="id" ...>...</tag>` (these registries never nest the same tag) */
function block(xml, tag, id) {
  const open = new RegExp(`<${tag}\\s[^>]*\\bid="${esc(id)}"[^>]*>`).exec(xml);
  if (!open) throw new Error(`${tag} "${id}" not found`);
  const close = xml.indexOf(`</${tag}>`, open.index);
  if (close < 0) throw new Error(`${tag} "${id}" is not closed`);
  return { start: open.index, end: close + tag.length + 3, open: open[0], openEnd: open.index + open[0].length, close };
}

const lineStart = (xml, i) => xml.lastIndexOf('\n', i - 1) + 1;
const indentOf = (xml, i) => /^[ \t]*/.exec(xml.slice(lineStart(xml, i)))[0];

// --- tokens.xml -------------------------------------------------------------------------------------------------------

function checkValue(kind, value) {
  const v = String(value).trim();
  if (kind === 'color' && !HEX.test(v)) throw new Error(`"${value}" is not a colour (#RGB or #RRGGBB)`);
  if (kind !== 'color' && !NUMBER.test(v)) throw new Error(`"${value}" is not a number`);
  return v;
}

function valueRe(id) {
  return new RegExp(`(<value\\s[^>]*\\bid="${esc(id)}"[^>]*>)([^<]*)(</value>)`);
}

function setValue(xml, token, id, value, kind) {
  const v = checkValue(kind, value);
  const b = block(xml, 'token', token);
  const body = xml.slice(b.start, b.end);
  const m = valueRe(id).exec(body);
  if (!m) throw new Error(`${token}.${id} not found`);
  return xml.slice(0, b.start) + body.replace(valueRe(id), (_, a, _t, c) => `${a}${xmlEsc(v)}${c}`) + xml.slice(b.end);
}

function addValue(xml, token, id, value, kind) {
  if (!VALUE_ID.test(id)) throw new Error(`"${id}" is not a valid id (letters, digits, . - _)`);
  const v = checkValue(kind, value);
  const b = block(xml, 'token', token);
  const body = xml.slice(b.start, b.end);
  if (valueRe(id).test(body)) throw new Error(`${token}.${id} already exists`);
  const closeValues = xml.indexOf('</values>', b.start);
  if (closeValues < 0 || closeValues > b.end) throw new Error(`${token} has no <values>`);
  const ind = indentOf(xml, closeValues) + '    ';
  const at = lineStart(xml, closeValues);
  return xml.slice(0, at) + `${ind}<value id="${id}">${xmlEsc(v)}</value>\n` + xml.slice(at);
}

function removeValue(xml, token, id) {
  const b = block(xml, 'token', token);
  const body = xml.slice(b.start, b.end);
  const m = new RegExp(`[ \\t]*<value\\s[^>]*\\bid="${esc(id)}"[^>]*>[^<]*</value>[ \\t]*\\r?\\n?`).exec(body);
  if (!m) throw new Error(`${token}.${id} not found`);
  return xml.slice(0, b.start + m.index) + xml.slice(b.start + m.index + m[0].length);
}

// --- themes.xml -------------------------------------------------------------------------------------------------------

function setRole(xml, theme, role, { ref, value }) {
  if (ref != null && !REF.test(ref)) throw new Error(`"${ref}" is not a $ref.<register>.<id> reference`);
  if (value != null && !HEX.test(value)) throw new Error(`"${value}" is not a colour (#RGB or #RRGGBB)`);
  if ((ref == null) === (value == null)) throw new Error('a role takes a reference or a colour, not both');
  const b = block(xml, 'theme', theme);
  const body = xml.slice(b.start, b.end);
  const re = new RegExp(`(<role\\s[^>]*\\bid="${esc(role)}"[^>]*>)([\\s\\S]*?)(</role>)`);
  const m = re.exec(body);
  if (!m) throw new Error(`role "${role}" not found in theme "${theme}"`);
  const inner = ref != null ? `<ref>${xmlEsc(ref)}</ref>` : `<value>${xmlEsc(value)}</value>`;
  const ind = /\n([ \t]*)</.exec(m[2])?.[1] ?? indentOf(xml, b.start) + '            ';
  return (
    xml.slice(0, b.start) +
    body.replace(re, (_, a, _i, c) => `${a}\n${ind}${inner}\n${ind.slice(4)}${c}`) +
    xml.slice(b.end)
  );
}

function checkTheme({ id, mode, variant }) {
  if (!ID.test(id)) throw new Error(`"${id}" is not a valid theme id (letters, digits and -, starting with a letter)`);
  if (!MODES.includes(mode)) throw new Error(`mode must be ${MODES.join(' or ')}`);
  if (!ID.test(variant)) throw new Error(`"${variant}" is not a valid variant name`);
}

const themeIds = (xml) => [...xml.matchAll(/<theme\s[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);

/** The `default` attribute of <themes> must name a theme that exists. */
function fixDefault(xml, was) {
  const ids = themeIds(xml);
  const m = /(<themes\b[^>]*\bdefault=")([^"]*)(")/.exec(xml);
  if (!m || !ids.length) return xml;
  const next = ids.includes(m[2]) ? m[2] : was && ids.includes(was) ? was : ids[0];
  return next === m[2] ? xml : xml.replace(m[0], `${m[1]}${next}${m[3]}`);
}

function addTheme(xml, { id, mode, variant, from }) {
  checkTheme({ id, mode, variant });
  if (themeIds(xml).includes(id)) throw new Error(`theme "${id}" already exists`);
  const b = block(xml, 'theme', from);
  const copy = xml.slice(b.start, b.end).replace(
    b.open,
    b.open
      .replace(/\bid="[^"]*"/, `id="${id}"`)
      .replace(/\bmode="[^"]*"/, `mode="${mode}"`)
      .replace(/\bvariant="[^"]*"/, `variant="${variant}"`),
  );
  const ind = indentOf(xml, b.start);
  return xml.slice(0, b.end) + `\n${ind}${copy}` + xml.slice(b.end);
}

function removeTheme(xml, id) {
  if (themeIds(xml).length <= 1) throw new Error('a registry needs at least one theme');
  const b = block(xml, 'theme', id);
  const was = /\bdefault="([^"]*)"/.exec(xml)?.[1];
  const from = lineStart(xml, b.start);
  const to = xml[b.end] === '\n' ? b.end + 1 : b.end;
  return fixDefault(xml.slice(0, from) + xml.slice(to), was === id ? null : was);
}

function setThemeAttrs(xml, id, { newId, mode, variant }) {
  const b = block(xml, 'theme', id);
  const cur = {
    id,
    mode: /\bmode="([^"]*)"/.exec(b.open)?.[1],
    variant: /\bvariant="([^"]*)"/.exec(b.open)?.[1] ?? 'default',
  };
  const next = { id: newId ?? cur.id, mode: mode ?? cur.mode, variant: variant ?? cur.variant };
  checkTheme(next);
  if (next.id !== id && themeIds(xml).includes(next.id)) throw new Error(`theme "${next.id}" already exists`);
  let open = b.open.replace(/\bid="[^"]*"/, `id="${next.id}"`).replace(/\bmode="[^"]*"/, `mode="${next.mode}"`);
  open = /\bvariant="/.test(open)
    ? open.replace(/\bvariant="[^"]*"/, `variant="${next.variant}"`)
    : open.replace(/>$/, ` variant="${next.variant}">`);
  const was = /\bdefault="([^"]*)"/.exec(xml)?.[1];
  let out = xml.slice(0, b.start) + open + xml.slice(b.openEnd);
  if (was === id && next.id !== id) out = out.replace(/(<themes\b[^>]*\bdefault=")[^"]*(")/, `$1${next.id}$2`);
  return out;
}

module.exports = {
  setValue,
  addValue,
  removeValue,
  setRole,
  addTheme,
  removeTheme,
  setThemeAttrs,
  themeIds,
  ID,
  HEX,
  REF,
  NUMBER,
};
