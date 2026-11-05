'use strict';
/** XSD lint of the registry files (agnostic: the manifest decides what is validated). */
const fs = require('fs');
const path = require('path');
const { parseFile, XmlError } = require('./xml');
const { NS, at } = require('./registry');
const { Schema, SchemaError, validateFile, XSI } = require('./xsd');

/** <file> entries of the manifest catalogs, plus <dir> templates ({Name} -> *). */
function discover(manifestPath) {
  const dir = path.dirname(manifestPath);
  let root;
  try {
    root = parseFile(manifestPath);
  } catch (e) {
    if (e instanceof XmlError) return [];
    throw e;
  }
  const files = [];
  for (const c of root.iter('catalog')) {
    const f = c.find('file', NS);
    if (f && f.text) files.push(path.join(dir, f.text));
    const d = c.find('dir', NS);
    if (d && d.text) {
      const re = new RegExp(
        `^${d.text
          .trim()
          .replace(/[.+^${}()|[\]\\]/g, '\\$&')
          .replace(/\\\{Name\\\}/g, '[^/]*')
          .replace(/\*/g, '[^/]*')}$`,
      );
      const base = path.dirname(path.join(dir, d.text.trim()));
      if (fs.existsSync(base))
        for (const n of fs.readdirSync(base).sort())
          if (re.test(path.relative(dir, path.join(base, n)).replace(/\\/g, '/'))) files.push(path.join(base, n));
    }
  }
  return [...new Set(files)].sort();
}

function schemaFromLocation(xmlPath) {
  const root = parseFile(xmlPath);
  const loc = root.attrs.find((a) => a.ns === XSI && a.name === 'schemaLocation');
  const parts = loc ? loc.value.split(/\s+/).filter(Boolean) : [];
  if (parts.length < 2) return null;
  const file = path.join(path.dirname(xmlPath), parts[parts.length - 1]);
  return fs.existsSync(file) ? Schema.fromFile(file) : null;
}

/** CLI: returns the exit code. */
function run({
  files = [],
  schema = null,
  manifest = null,
  dir = null,
  verbose = false,
  out = console.log,
  err = console.error,
}) {
  const list = [];
  if (manifest) list.push(...discover(path.resolve(manifest)));
  if (dir)
    list.push(
      ...fs
        .readdirSync(dir)
        .filter((n) => n.endsWith('.xml'))
        .sort()
        .map((n) => path.join(dir, n)),
    );
  list.push(...files);
  const targets = [...new Set(list)];
  if (!targets.length) {
    err('No files to validate');
    return 2;
  }
  let loaded = null;
  try {
    if (schema) loaded = Schema.fromFile(schema);
  } catch (e) {
    if (e instanceof SchemaError) {
      err(`Invalid XSD schema: ${e.message}`);
      return 2;
    }
    throw e;
  }
  let valid = 0;
  let invalid = 0;
  for (const file of targets) {
    let s = loaded;
    if (!s) {
      try {
        s = schemaFromLocation(file);
      } catch (e) {
        if (!(e instanceof XmlError)) throw e;
      }
    }
    let result;
    if (!s && fs.existsSync(file)) {
      let broken = null;
      try {
        parseFile(file);
      } catch (e) {
        if (e instanceof XmlError) broken = e;
        else throw e;
      }
      result = broken
        ? {
            errors: [
              {
                file,
                line: broken.line,
                column: broken.column,
                message: `Malformed XML: ${broken.message}`,
                severity: 'error',
              },
            ],
            valid: false,
          }
        : {
            errors: [{ file, line: null, column: null, message: 'No schema available', severity: 'warning' }],
            valid: true,
          };
    } else result = validateFile(s, file);
    result.valid ? valid++ : invalid++;
    if (verbose || result.errors.length) {
      out(`--- ${file} ---`);
      for (const e of result.errors)
        out(
          `  [${e.severity.toUpperCase()}] ${e.file}${e.line != null ? `:${e.line}${e.column != null ? `:${e.column}` : ''}` : ''}: ${e.message}`,
        );
      if (!result.errors.length) out('  OK');
    }
  }
  out('');
  out(`Files checked: ${targets.length}\nValid: ${valid}\nInvalid: ${invalid}`);
  return invalid ? 1 : 0;
}

module.exports = { run, discover };
