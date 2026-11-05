'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const DESIGN = path.resolve(__dirname, '..', '..');
// The registries the golden output was recorded from, frozen: the shipped registries are free to change.
const FIXTURES = path.join(__dirname, 'fixtures');
const MUTATIONS = JSON.parse(fs.readFileSync(path.join(__dirname, 'mutations.json'), 'utf8'));
const GOLDEN = JSON.parse(fs.readFileSync(path.join(__dirname, 'golden.json'), 'utf8'));

/** The schema as it was when the golden output was recorded: XSD identity constraints written without a namespace prefix. */
function legacySchema() {
  return fs
    .readFileSync(path.join(DESIGN, 'schema.xsd'), 'utf8')
    .replace(/xpath="\.\/(?:r:[\w.-]+\/?)+"/g, (m) => m.replace(/r:/g, ''));
}

/** A throw-away project: design/{manifest,tokens,themes,canonical.index}, the legacy-xpath schema, package.json, then the edits. */
function build(mutation, { schema = legacySchema() } = {}) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'fdesign-')));
  const d = path.join(root, 'design');
  fs.mkdirSync(d);
  for (const f of ['manifest.xml', 'tokens.xml', 'themes.xml', 'canonical.index.txt'])
    fs.copyFileSync(path.join(FIXTURES, f), path.join(d, f));
  fs.writeFileSync(path.join(d, 'schema.xsd'), schema);
  fs.copyFileSync(path.join(DESIGN, '..', 'package.json'), path.join(root, 'package.json'));
  fs.mkdirSync(path.join(root, 'components/ui/gluestack-ui-provider'), { recursive: true });
  // the golden output predates the provider-neutral theme: the parity copies do not declare it
  const mf = path.join(d, 'manifest.xml');
  fs.writeFileSync(mf, fs.readFileSync(mf, 'utf8').replace(/\n\s*<designTheme>[^<]*<\/designTheme>/, ''));
  for (const e of mutation ? mutation.edits : []) {
    const p = path.join(d, e.file);
    const s = fs.readFileSync(p, 'utf8');
    if (!s.includes(e.find)) throw new Error(`mutation ${mutation.name}: text not found: ${e.find.slice(0, 40)}`);
    fs.writeFileSync(
      p,
      s.replace(e.find, () => e.replace),
    );
  }
  return root;
}

/** Runs fn with a collecting `out`; returns { code, lines }. */
function capture(fn) {
  const lines = [];
  const out = (...a) => lines.push(...a.join(' ').split('\n'));
  const code = fn(out);
  return { code, lines };
}

/** Path-free, message-free view used to compare against the recorded Python output. */
function normalise(lines, root) {
  const out = [];
  for (const raw of lines) {
    const l = raw
      .split(root)
      .join('<ROOT>')
      // messages that now name the Node commands instead of the Python scripts
      .replace('run `flipova-design canonical` and commit the new file', 'run --emit-canonical and commit the new file')
      .replace(
        'canonical index file missing; run `flipova-design canonical`',
        'canonical index file missing; run --emit-canonical',
      )
      .replace('run `flipova-design check --sync-version`', 'run `checker.py --sync-version`');
    let m;
    if (/^\s*\[(ERROR|WARNING)\].*\[rule=xsd\]/.test(l) && (m = /^\s*\[\w+\] (\S+?):(\d+) /.exec(l)))
      out.push(`XSD ${m[1]} ${m[2]}`);
    else if (
      /^\s*\[(ERROR|WARNING)\] <ROOT>.*?:\d+(:\d+)?: /.test(l) &&
      !l.includes('rule=') &&
      (m = /^\s*\[\w+\] (\S+?):(\d+)/.exec(l))
    )
      out.push(`LINT ${m[1]} ${m[2]}`);
    else out.push(l.replace(/\s+$/, ''));
  }
  return out;
}

module.exports = { DESIGN, MUTATIONS, GOLDEN, build, capture, normalise, legacySchema };
