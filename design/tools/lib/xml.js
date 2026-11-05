'use strict';
/**
 * Minimal, dependency-free XML reader (what the registries need, nothing more).
 *
 * Supports: prolog, comments, processing instructions, CDATA, the five predefined entities and numeric character
 * references, namespaces (default and prefixed), attributes, mixed content. Refuses DOCTYPE with an internal subset
 * (no entity expansion: nothing to abuse) and anything malformed, with the line of the problem.
 *
 * Element: { name, ns, prefix, attrs: [{name, ns, prefix, value}], children: [Element], text, line, parent, root? }
 *   - `text`  is the text before the first child element (lxml's `.text`); `allText` is all the character data;
 *   - `line`  is the line where the start tag ends, which is what libxml2 reports as `sourceline`;
 *   - `get(name)` reads an un-prefixed attribute (lxml's `elem.get`).
 */

class XmlError extends Error {
  constructor(message, line, column) {
    super(message);
    this.name = 'XmlError';
    this.line = line;
    this.column = column;
  }
}

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decode(raw, fail) {
  if (!raw.includes('&')) return raw;
  return raw.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[A-Za-z_][\w.-]*);/g, (m, body) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      if (!(
        code === 9 ||
        code === 10 ||
        code === 13 ||
        (code >= 32 && code <= 0xd7ff) ||
        (code >= 0xe000 && code <= 0xfffd) ||
        (code >= 0x10000 && code <= 0x10ffff)
      ))
        fail(`invalid character reference ${m}`);
      return String.fromCodePoint(code);
    }
    if (!(body in NAMED)) fail(`undefined entity ${m}`);
    return NAMED[body];
  });
}

const NAME = /^[A-Za-z_:À-￿][\w:.\-·À-￿]*/;

class Element {
  constructor(name, prefix, line) {
    this.name = name;
    this.prefix = prefix;
    this.ns = null;
    this.attrs = [];
    this.children = [];
    this.text = '';
    this.allText = '';
    this.line = line;
    this.parent = null;
    this.nsmap = {};
  }

  get(name) {
    const a = this.attrs.find((x) => !x.prefix && x.name === name);
    return a ? a.value : null;
  }

  has(name) {
    return this.get(name) !== null;
  }

  /** Direct children with this local name (and namespace, when given). */
  findAll(name, ns) {
    return this.children.filter((c) => c.name === name && (ns === undefined || c.ns === ns));
  }

  find(name, ns) {
    return this.children.find((c) => c.name === name && (ns === undefined || c.ns === ns)) ?? null;
  }

  /** Text of the first child with this name (lxml's `findtext`), or null. */
  findText(name, ns) {
    const c = this.find(name, ns);
    return c ? c.text : null;
  }

  /** Document-order iteration of this element and its descendants (lxml's `iter`). */
  *iter(name, ns) {
    if ((name === undefined || this.name === name) && (ns === undefined || this.ns === ns)) yield this;
    for (const c of this.children) yield* c.iter(name, ns);
  }
}

function parse(source, file = '') {
  let src = String(source);
  if (src.charCodeAt(0) === 0xfeff) src = src.slice(1);
  src = src.replace(/\r\n?/g, '\n');
  let i = 0;
  let line = 1;
  const fail = (msg, at = i) => {
    let l = 1;
    let c = 1;
    for (let k = 0; k < at && k < src.length; k++) src[k] === '\n' ? (l++, (c = 1)) : c++;
    throw new XmlError(msg, l, c);
  };
  const advance = (to) => {
    for (let k = i; k < to; k++) if (src[k] === '\n') line++;
    i = to;
  };

  let root = null;
  let cur = null;
  const stack = [];
  const scopes = [{ xml: 'http://www.w3.org/XML/1998/namespace' }];
  const lookup = (prefix) => {
    for (let k = scopes.length - 1; k >= 0; k--) if (prefix in scopes[k]) return scopes[k][prefix];
    return prefix === '' ? null : undefined;
  };
  const addText = (t) => {
    if (!cur) {
      if (t.trim()) fail('text outside the root element');
      return;
    }
    cur.allText += t;
    if (cur.children.length === 0) cur.text += t;
  };

  while (i < src.length) {
    if (src[i] !== '<') {
      const next = src.indexOf('<', i);
      const end = next === -1 ? src.length : next;
      const raw = src.slice(i, end);
      if (raw.includes(']]>')) fail("']]>' is not allowed in character data");
      addText(decode(raw, (m) => fail(m)));
      advance(end);
      continue;
    }
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      if (end === -1) fail('unterminated comment');
      if (src.slice(i + 4, end).includes('--')) fail("'--' is not allowed inside a comment");
      advance(end + 3);
    } else if (src.startsWith('<![CDATA[', i)) {
      const end = src.indexOf(']]>', i);
      if (end === -1) fail('unterminated CDATA section');
      if (!cur) fail('CDATA outside the root element');
      addText(src.slice(i + 9, end));
      advance(end + 3);
    } else if (src.startsWith('<?', i)) {
      const end = src.indexOf('?>', i);
      if (end === -1) fail('unterminated processing instruction');
      advance(end + 2);
    } else if (src.startsWith('<!DOCTYPE', i)) {
      const end = src.indexOf('>', i);
      if (end === -1 || src.slice(i, end).includes('[')) fail('DOCTYPE with an internal subset is not supported');
      advance(end + 1);
    } else if (src.startsWith('</', i)) {
      const end = src.indexOf('>', i);
      if (end === -1) fail('unterminated end tag');
      const nm = src.slice(i + 2, end).trim();
      if (!cur) fail(`unexpected end tag </${nm}>`);
      const full = cur.prefix ? `${cur.prefix}:${cur.name}` : cur.name;
      if (nm !== full) fail(`end tag </${nm}> does not match <${full}>`);
      advance(end + 1);
      scopes.pop();
      cur = stack.pop() ?? null;
    } else {
      // start tag
      const start = i;
      let k = i + 1;
      const m = NAME.exec(src.slice(k));
      if (!m) fail('invalid element name', k);
      const qname = m[0];
      k += qname.length;
      const attrs = [];
      let selfClosing = false;
      const seen = new Set();
      while (true) {
        const ws = /^\s*/.exec(src.slice(k))[0].length;
        k += ws;
        if (k >= src.length) fail('unterminated start tag', start);
        if (src[k] === '>') {
          k++;
          break;
        }
        if (src.startsWith('/>', k)) {
          selfClosing = true;
          k += 2;
          break;
        }
        if (ws === 0) fail('attributes must be separated by white space', k);
        const am = NAME.exec(src.slice(k));
        if (!am) fail('invalid attribute name', k);
        k += am[0].length;
        const eq = /^\s*=\s*/.exec(src.slice(k));
        if (!eq) fail(`attribute ${am[0]} has no value`, k);
        k += eq[0].length;
        const q = src[k];
        if (q !== '"' && q !== "'") fail('attribute value must be quoted', k);
        const close = src.indexOf(q, k + 1);
        if (close === -1) fail('unterminated attribute value', k);
        const rawv = src.slice(k + 1, close);
        if (rawv.includes('<')) fail("'<' is not allowed in an attribute value", k);
        if (seen.has(am[0])) fail(`duplicate attribute ${am[0]}`, k);
        seen.add(am[0]);
        attrs.push([am[0], decode(rawv.replace(/[\t\n]/g, ' '), (mm) => fail(mm, k))]);
        k = close + 1;
      }
      advance(k);
      const [prefix, local] = qname.includes(':') ? qname.split(/:(.*)/s).slice(0, 2) : ['', qname];
      const scope = {};
      const real = [];
      for (const [n, v] of attrs) {
        if (n === 'xmlns') scope[''] = v || null;
        else if (n.startsWith('xmlns:')) scope[n.slice(6)] = v;
        else real.push([n, v]);
      }
      scopes.push(scope);
      const el = new Element(local, prefix, line);
      el.nsmap = Object.assign({}, cur ? cur.nsmap : {}, scope);
      el.ns = lookup(prefix);
      if (el.ns === undefined) fail(`namespace prefix ${prefix} is not defined`, start);
      for (const [n, v] of real) {
        const [ap, al] = n.includes(':') ? n.split(/:(.*)/s).slice(0, 2) : ['', n];
        const ans = ap ? lookup(ap) : null;
        if (ap && ans === undefined) fail(`namespace prefix ${ap} is not defined`, start);
        el.attrs.push({ name: al, prefix: ap, ns: ans, value: v });
      }
      if (cur) {
        el.parent = cur;
        cur.children.push(el);
      } else if (root) fail('only one root element is allowed', start);
      else root = el;
      if (selfClosing) scopes.pop();
      else {
        stack.push(cur);
        cur = el;
      }
    }
  }
  if (cur) fail(`element <${cur.name}> is not closed`, src.length);
  if (!root) fail('no root element', 0);
  root.file = file;
  return root;
}

function parseFile(path) {
  const fs = require('fs');
  try {
    return parse(fs.readFileSync(path, 'utf8'), path);
  } catch (e) {
    if (e instanceof XmlError) e.file = path;
    throw e;
  }
}

module.exports = { parse, parseFile, XmlError, Element };
