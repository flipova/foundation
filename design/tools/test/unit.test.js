'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { parse, XmlError } = require('../lib/xml');
const { Schema, SchemaError } = require('../lib/xsd');
const { pyRepr, sortNatural } = require('../lib/util');
const { build, capture, DESIGN } = require('./helpers');
const check = require('../lib/check');
const generate = require('../lib/generate');
const lint = require('../lib/lint');
const cli = require('../cli');

test('xml: structure, namespaces, entities, CDATA, lines', () => {
  const r = parse(
    '<?xml version="1.0"?>\n<!-- c -->\n<a xmlns="urn:x" xmlns:p="urn:p" k="1 &amp; 2">\n  <p:b id="&#65;">t &lt; <![CDATA[<raw>]]></p:b>\n  <c/>\n</a>',
  );
  assert.equal(r.ns, 'urn:x');
  assert.equal(r.get('k'), '1 & 2');
  const [b, c] = r.children;
  assert.equal(b.ns, 'urn:p');
  assert.equal(b.get('id'), 'A');
  assert.equal(b.text, 't < <raw>');
  assert.equal(c.ns, 'urn:x');
  assert.equal(b.line, 4);
  assert.deepEqual(
    [...r.iter()].map((e) => e.name),
    ['a', 'b', 'c'],
  );
});

test('xml: malformed documents are refused with a line', () => {
  for (const bad of [
    '<a><b></a>',
    '<a>',
    '<a x=1/>',
    '<a x="1" x="2"/>',
    '<a/><b/>',
    '<p:a/>',
    '<a>&nope;</a>',
    '',
    'text',
    '<!DOCTYPE a [<!ENTITY e "x">]><a>&e;</a>',
    '<a><!-- -- --></a>',
  ]) {
    assert.throws(() => parse(bad), XmlError, bad);
  }
  try {
    parse('<a>\n<b>\n</a>');
  } catch (e) {
    assert.equal(e.line, 3);
  }
});

test('xsd: unsupported schema constructs are refused, never ignored', () => {
  const xs = (body) => `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">${body}</xs:schema>`;
  assert.throws(() => Schema.fromString(xs('<xs:group name="g"/>')), SchemaError);
  assert.throws(
    () => Schema.fromString(xs('<xs:element name="a"><xs:complexType><xs:all/></xs:complexType></xs:element>')),
    SchemaError,
  );
  assert.throws(() => Schema.fromString('<root/>'), SchemaError);
});

test('xsd: uniqueness is enforced with the namespace-aware schema, and was silently vacuous without the prefix', () => {
  const dup = (schemaText) => {
    const root = build(
      { name: 'dup', edits: [{ file: 'tokens.xml', find: '<token id="radii"', replace: '<token id="spacing"' }] },
      { schema: schemaText },
    );
    const r = capture((out) =>
      lint.run({ schema: path.join(root, 'design/schema.xsd'), files: [path.join(root, 'design/tokens.xml')], out }),
    );
    fs.rmSync(root, { recursive: true, force: true });
    return r;
  };
  const prefixed = fs.readFileSync(path.join(DESIGN, 'schema.xsd'), 'utf8');
  const bare = prefixed.replace(/xpath="\.\/(?:r:[\w.-]+\/?)+"/g, (m) => m.replace(/r:/g, ''));
  const a = dup(prefixed);
  assert.equal(a.code, 1);
  assert.match(
    a.lines.join('\n'),
    /Duplicate key-sequence \['spacing'\] in unique identity-constraint 'TokenIdUnique'/,
  );
  assert.equal(dup(bare).code, 0, 'an unprefixed xpath selects no-namespace elements, i.e. nothing');
});

test('util: python-style repr and natural order', () => {
  assert.equal(pyRepr("it's"), '"it\'s"');
  assert.equal(pyRepr(['a', 'b']), "['a', 'b']");
  assert.deepEqual(sortNatural(['a10', 'a2', 'A3', 'b1']), ['a2', 'A3', 'a10', 'b1']);
});

test('the committed registries are clean and the generated files up to date', () => {
  const root = path.resolve(DESIGN, '..');
  const manifest = path.join(DESIGN, 'manifest.xml');
  const schema = path.join(DESIGN, 'schema.xsd');
  assert.equal(capture((out) => check.run({ root, manifest, schema, check: true, out })).code, 0);
  assert.equal(
    capture((out) =>
      check.run({
        root,
        manifest,
        check: false,
        verifyCanonical: true,
        outFile: path.join(DESIGN, 'canonical.index.txt'),
        out,
      }),
    ).code,
    0,
  );
  assert.equal(capture((out) => lint.run({ manifest, schema, dir: DESIGN, out })).code, 0);
  assert.equal(capture((out) => generate.run({ root, manifest, check: true, out, err: out })).code, 0);
});

test('cli: unknown command and missing command', () => {
  const saved = process.argv;
  const err = process.stderr.write;
  process.stderr.write = () => true;
  try {
    process.argv = ['node', 'cli.js', 'nope'];
    assert.equal(cli.main(), 2);
    process.argv = ['node', 'cli.js'];
    assert.equal(cli.main(), 2);
  } finally {
    process.argv = saved;
    process.stderr.write = err;
  }
});
