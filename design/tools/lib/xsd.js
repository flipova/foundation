'use strict';
/**
 * XML Schema validation for the subset the registries use — no dependency, no native library.
 *
 * Supported: global/local elements, named and anonymous complexType / simpleType, sequence and choice (nested, with
 * minOccurs / maxOccurs), attributes (use, fixed, type), mixed content, simpleContent/extension, restriction with
 * enumeration / pattern / length facets, xs:unique, the common builtin types. Anything else in a schema is refused
 * with a clear message instead of being silently ignored, so a schema can never be "validated" by a validator that
 * does not understand it.
 *
 * Verdicts (valid / invalid, and which element or attribute is at fault) are meant to match libxml2's; the wording of
 * the messages follows it closely but is not identical.
 */
const fs = require('fs');
const { parse, parseFile, XmlError } = require('./xml');

const XS = 'http://www.w3.org/2001/XMLSchema';
const XSI = 'http://www.w3.org/2001/XMLSchema-instance';

class SchemaError extends Error {}

const BUILTIN = {
  string: () => true,
  normalizedString: () => true,
  token: () => true,
  anyURI: () => true,
  NMTOKEN: (v) => /^[\w.:\-]+$/.test(v.trim()),
  NCName: (v) => /^[A-Za-z_][\w.\-]*$/.test(v.trim()),
  boolean: (v) => ['true', 'false', '1', '0'].includes(v.trim()),
  integer: (v) => /^[+-]?\d+$/.test(v.trim()),
  int: (v) => /^[+-]?\d+$/.test(v.trim()),
  long: (v) => /^[+-]?\d+$/.test(v.trim()),
  nonNegativeInteger: (v) => /^\+?\d+$/.test(v.trim()),
  positiveInteger: (v) => /^\+?0*[1-9]\d*$/.test(v.trim()),
  decimal: (v) => /^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(v.trim()),
};

const local = (q) => (q && q.includes(':') ? q.split(':').pop() : q);
const kids = (el, name) => el.children.filter((c) => c.ns === XS && c.name === name);
const content = (el) => el.children.filter((c) => c.ns === XS && c.name !== 'annotation');
const occurs = (el) => ({
  min: el.get('minOccurs') === null ? 1 : Number(el.get('minOccurs')),
  max: el.get('maxOccurs') === null ? 1 : el.get('maxOccurs') === 'unbounded' ? Infinity : Number(el.get('maxOccurs')),
});

class Schema {
  constructor(root) {
    if (!root || root.ns !== XS || root.name !== 'schema') throw new SchemaError('not an XML Schema document');
    this.tns = root.get('targetNamespace');
    this.complex = new Map();
    this.simple = new Map();
    this.elements = new Map();
    for (const c of content(root)) {
      const name = c.get('name');
      if (c.name === 'complexType') this.complex.set(name, c);
      else if (c.name === 'simpleType') this.simple.set(name, c);
      else if (c.name === 'element') this.elements.set(name, this.element(c));
      else throw new SchemaError(`unsupported schema construct <xs:${c.name}>`);
    }
    this.cache = new Map();
    // compile everything now: an unsupported construct must fail when the schema is loaded, not when a file happens to reach it
    for (const n of [...this.complex.keys(), ...this.simple.keys()]) this.named(n);
    for (const d of this.elements.values()) this.warm(d);
  }

  warm(decl) {
    const t = this.typeOf(decl);
    const walk = (p) => (p.kind === 'element' ? this.warm(p.decl) : p.items.forEach(walk));
    if (t.complex && t.complex.particle) walk(t.complex.particle);
  }

  static fromFile(path) {
    try {
      return new Schema(parseFile(path));
    } catch (e) {
      if (e instanceof XmlError) throw new SchemaError(`invalid XSD schema ${path}: ${e.message} (line ${e.line})`);
      throw e;
    }
  }

  static fromString(text) {
    return new Schema(parse(text));
  }

  element(el) {
    if (el.get('ref') !== null) throw new SchemaError('unsupported schema construct: <xs:element ref>');
    const decl = { name: el.get('name'), typeName: el.get('type'), inline: null, unique: [], ...occurs(el) };
    for (const c of content(el)) {
      if (c.name === 'complexType' || c.name === 'simpleType') decl.inline = c;
      else if (c.name === 'unique') {
        const sel = kids(c, 'selector')[0];
        decl.unique.push({
          name: c.get('name'),
          selector: this.path(sel.get('xpath'), sel),
          fields: kids(c, 'field').map((f) => this.field(f.get('xpath'), f)),
        });
      } else throw new SchemaError(`unsupported schema construct <xs:${c.name}> inside <xs:element>`);
    }
    return decl;
  }

  /**
   * XSD xpath: an UNPREFIXED name means "no namespace" (the default namespace does not apply), so a selector written
   * `./items/token` against elements in a target namespace selects nothing. A prefixed step uses the prefix in scope.
   */
  step(raw, at, xpath) {
    const m = /^(?:([A-Za-z_][\w.\-]*):)?([A-Za-z_][\w.\-]*)$/.exec(raw);
    if (!m) throw new SchemaError(`unsupported xpath '${xpath}' (child steps only)`);
    const ns = m[1] ? at.nsmap[m[1]] : null;
    if (m[1] && ns === undefined) throw new SchemaError(`xpath '${xpath}': namespace prefix '${m[1]}' is not declared`);
    return { ns: ns ?? null, name: m[2] };
  }

  path(xpath, at) {
    return xpath
      .replace(/^\.\/?/, '')
      .split('/')
      .filter(Boolean)
      .map((s) => this.step(s, at, xpath));
  }

  field(xpath, at) {
    return xpath.startsWith('@')
      ? { attr: this.step(xpath.slice(1), at, xpath) }
      : { child: this.step(xpath.replace(/^\.\//, ''), at, xpath) };
  }

  /** Resolved type of an element declaration: { builtin } | { simple } | { complex }. */
  typeOf(decl) {
    if (decl.inline)
      return decl.inline.name === 'complexType'
        ? { complex: this.compileComplex(decl.inline) }
        : { simple: this.compileSimple(decl.inline) };
    if (!decl.typeName) return { builtin: 'string' }; // xs:anyType, narrowed to text
    return this.named(decl.typeName);
  }

  named(typeName) {
    const n = local(typeName);
    const prefixIsXs = typeName.includes(':') && !this.complex.has(n) && !this.simple.has(n);
    if (prefixIsXs || (!this.complex.has(n) && !this.simple.has(n))) {
      if (!(n in BUILTIN)) throw new SchemaError(`unsupported or unknown type '${typeName}'`);
      return { builtin: n };
    }
    if (!this.cache.has(n)) {
      this.cache.set(
        n,
        this.complex.has(n)
          ? { complex: this.compileComplex(this.complex.get(n)) }
          : { simple: this.compileSimple(this.simple.get(n)) },
      );
    }
    return this.cache.get(n);
  }

  compileSimple(st) {
    const r = kids(st, 'restriction')[0];
    if (!r) throw new SchemaError('unsupported simpleType (restriction only)');
    const facets = { enumeration: [], pattern: [], base: local(r.get('base')) };
    if (!(facets.base in BUILTIN) && !this.simple.has(facets.base))
      throw new SchemaError(`unsupported simpleType base '${r.get('base')}'`);
    for (const f of content(r)) {
      if (f.name === 'enumeration') facets.enumeration.push(f.get('value'));
      else if (f.name === 'pattern') facets.pattern.push(new RegExp(`^(?:${f.get('value')})$`));
      else if (f.name === 'minLength') facets.minLength = Number(f.get('value'));
      else if (f.name === 'maxLength') facets.maxLength = Number(f.get('value'));
      else throw new SchemaError(`unsupported facet <xs:${f.name}>`);
    }
    return facets;
  }

  attributes(parent) {
    return kids(parent, 'attribute').map((a) => {
      if (a.get('ref') !== null) throw new SchemaError('unsupported schema construct: <xs:attribute ref>');
      const inline = kids(a, 'simpleType')[0];
      return {
        name: a.get('name'),
        type: inline ? { simple: this.compileSimple(inline) } : this.named(a.get('type') || 'xs:string'),
        use: a.get('use') || 'optional',
        fixed: a.get('fixed'),
      };
    });
  }

  compileComplex(ct) {
    const out = { mixed: ct.get('mixed') === 'true', particle: null, attrs: [], simple: null };
    for (const c of content(ct)) {
      if (c.name === 'sequence' || c.name === 'choice') out.particle = this.particle(c);
      else if (c.name === 'attribute') continue;
      else if (c.name === 'simpleContent') {
        const ext = kids(c, 'extension')[0];
        if (!ext) throw new SchemaError('unsupported simpleContent (extension only)');
        out.simple = this.named(ext.get('base'));
        out.attrs.push(...this.attributes(ext));
      } else throw new SchemaError(`unsupported schema construct <xs:${c.name}> inside <xs:complexType>`);
    }
    out.attrs.push(...this.attributes(ct));
    return out;
  }

  particle(el) {
    if (el.name === 'element') {
      const decl = this.element(el);
      return { kind: 'element', decl, ...occurs(el) };
    }
    return {
      kind: el.name,
      items: content(el).map((c) => {
        if (c.name === 'element' || c.name === 'sequence' || c.name === 'choice') return this.particle(c);
        throw new SchemaError(`unsupported schema construct <xs:${c.name}> in a content model`);
      }),
      ...occurs(el),
    };
  }
}

// --- validation ----------------------------------------------------------------------------------------------------

const qn = (el) => el.name;
const blank = (s) => !s || !s.trim();

function simpleProblem(schema, type, value) {
  if (type.builtin)
    return BUILTIN[type.builtin](value)
      ? null
      : `'${value}' is not a valid value of the atomic type 'xs:${type.builtin}'.`;
  if (type.simple) {
    const f = type.simple;
    if (f.base in BUILTIN && !BUILTIN[f.base](value))
      return `'${value}' is not a valid value of the atomic type 'xs:${f.base}'.`;
    if (f.enumeration.length && !f.enumeration.includes(value))
      return `[facet 'enumeration'] The value '${value}' is not an element of the set {${f.enumeration.map((v) => `'${v}'`).join(', ')}}.`;
    if (f.pattern.length && !f.pattern.some((re) => re.test(value)))
      return `[facet 'pattern'] The value '${value}' is not accepted by the pattern.`;
    if (f.minLength !== undefined && value.length < f.minLength)
      return `[facet 'minLength'] The value has a length of '${value.length}'; this underruns the allowed minimum length of '${f.minLength}'.`;
    if (f.maxLength !== undefined && value.length > f.maxLength)
      return `[facet 'maxLength'] The value has a length of '${value.length}'; this exceeds the allowed maximum length of '${f.maxLength}'.`;
  }
  return null;
}

/** Possible end positions after matching `p` against kids[i..] (every way, since the model may be ambiguous). */
function matcher(schema, nodes, tns, tried) {
  let reached = 0;
  const once = (p, i) => {
    if (p.kind === 'element') {
      (tried.get(i) ?? tried.set(i, new Set()).get(i)).add(p.decl.name);
      const n = nodes[i];
      if (n && n.name === p.decl.name && n.ns === tns) {
        reached = Math.max(reached, i + 1);
        return new Set([i + 1]);
      }
      return new Set();
    }
    if (p.kind === 'sequence') {
      let cur = new Set([i]);
      for (const item of p.items) {
        const next = new Set();
        for (const s of cur) for (const e of repeat(item, s)) next.add(e);
        cur = next;
        if (!cur.size) break;
      }
      return cur;
    }
    const out = new Set();
    for (const item of p.items) for (const s of repeat(item, i)) out.add(s);
    return out;
  };
  const repeat = (p, i) => {
    const result = new Set();
    let states = new Set([i]);
    if (p.min === 0) result.add(i);
    const seen = new Set([i]);
    for (let count = 1; count <= p.max && states.size; count++) {
      const next = new Set();
      for (const s of states) for (const e of once(p, s)) if (!(count > nodes.length + 1)) next.add(e);
      if (count >= p.min) for (const e of next) result.add(e);
      states = new Set([...next].filter((e) => !(seen.has(e) && count >= p.min)));
      for (const e of next) seen.add(e);
    }
    return result;
  };
  return { fits: (p) => repeat(p, 0), reached: () => reached };
}

function validateElement(schema, el, decl, errors, file) {
  const err = (e, message, attr) =>
    errors.push({
      file,
      line: e.line,
      column: null,
      message: `Element '${qn(e)}'${attr ? `, attribute '${attr}'` : ''}: ${message}`,
    });
  const type = schema.typeOf(decl);

  if (type.builtin || type.simple) {
    if (el.children.length) err(el, 'Element content is not allowed, because the type definition is simple.');
    const p = simpleProblem(schema, type, el.allText);
    if (p) err(el, `${p}`);
    for (const a of el.attrs) if (a.ns !== XSI) err(el, `The attribute '${a.name}' is not allowed.`, a.name);
  } else {
    const ct = type.complex;
    // attributes
    for (const a of el.attrs) {
      if (a.ns === XSI) continue;
      const d = a.prefix ? null : ct.attrs.find((x) => x.name === a.name);
      if (!d) {
        err(el, `The attribute '${a.name}' is not allowed.`, a.name);
        continue;
      }
      if (d.fixed !== null && a.value !== d.fixed)
        err(el, `The value '${a.value}' does not match the fixed value constraint '${d.fixed}'.`, a.name);
      else {
        const p = simpleProblem(schema, d.type, a.value);
        if (p) err(el, p, a.name);
      }
    }
    for (const d of ct.attrs)
      if (d.use === 'required' && !el.has(d.name)) err(el, `The attribute '${d.name}' is required but missing.`);

    if (ct.simple) {
      if (el.children.length) err(el, 'Element content is not allowed, because the type definition is simple.');
      const p = simpleProblem(schema, ct.simple, el.allText);
      if (p) err(el, p);
    } else {
      if (!ct.mixed && !blank(el.allText))
        err(el, "Character content other than whitespace is not allowed because the content type is 'element-only'.");
      const tried = new Map();
      if (!ct.particle) {
        if (el.children.length) err(el.children[0], 'This element is not expected. No child element is allowed here.');
      } else {
        const m = matcher(schema, el.children, schema.tns, tried);
        if (!m.fits(ct.particle).has(el.children.length)) {
          const at = m.reached();
          const exp = [...(tried.get(at) ?? [])];
          if (at < el.children.length)
            err(
              el.children[at],
              `This element is not expected.${exp.length ? ` Expected is ( ${exp.join(' | ')} ).` : ''}`,
            );
          else err(el, `Missing child element(s).${exp.length ? ` Expected is ( ${exp.join(' | ')} ).` : ''}`);
        } else {
          // the content model fits: descend, pairing each child with its declaration
          const decls = new Map();
          const collect = (p) => (p.kind === 'element' ? decls.set(p.decl.name, p.decl) : p.items.forEach(collect));
          collect(ct.particle);
          for (const c of el.children) {
            const d = decls.get(c.name);
            if (d && c.ns === schema.tns) validateElement(schema, c, d, errors, file);
          }
        }
      }
    }
  }

  // xs:unique, evaluated at the element that declares it
  for (const u of decl.unique) {
    let nodes = [el];
    for (const step of u.selector)
      nodes = nodes.flatMap((n) => n.children.filter((c) => c.name === step.name && c.ns === step.ns));
    const seen = new Map();
    for (const n of nodes) {
      const key = u.fields.map((f) =>
        f.attr
          ? n.get(f.attr.name)
          : (n.children.find((c) => c.name === f.child.name && c.ns === f.child.ns)?.text ?? null),
      );
      if (key.some((k) => k === null)) continue;
      const k = JSON.stringify(key);
      if (seen.has(k))
        err(
          n,
          `Duplicate key-sequence [${key.map((v) => `'${v}'`).join(', ')}] in unique identity-constraint '${u.name}'.`,
        );
      else seen.set(k, n);
    }
  }
}

/** Validates one file. Returns { errors: [{file,line,column,message,severity}], valid }. */
function validateFile(schema, file) {
  const errors = [];
  let root;
  try {
    root = parseFile(file);
  } catch (e) {
    if (e instanceof XmlError)
      return {
        errors: [{ file, line: e.line, column: e.column, message: `Malformed XML: ${e.message}`, severity: 'error' }],
        valid: false,
      };
    throw e;
  }
  const decl = root.ns === schema.tns ? schema.elements.get(root.name) : null;
  if (!decl)
    errors.push({
      file,
      line: root.line,
      column: null,
      message: `Element '${root.name}': No matching global declaration available for the validation root.`,
    });
  else validateElement(schema, root, decl, errors, file);
  for (const e of errors) e.severity = 'error';
  return { errors, valid: errors.length === 0 };
}

module.exports = { Schema, SchemaError, validateFile, XSI };
