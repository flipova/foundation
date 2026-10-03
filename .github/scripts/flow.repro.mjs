/**
 * Reproduces the reported failure: a help flag was obeyed instead of answered.
 *
 * `flow issue archive --help` archived every closed issue, `maintain fix --help`
 * walked into repair mode, and `flow clean --help` would have deleted the merged
 * branches on its way. Both scripts file every `--x` under their flags, so
 * `args` never held `--help` and the `case '--help'` in their dispatchers could
 * not be reached.
 *
 *   node .github/scripts/flow.repro.mjs
 *
 * Prints one line per case, then the verdict. Exit code 0 = every help flag was
 * answered and the tree did not move, 1 = a command ran.
 *
 * Run it on the fixed tree: the cases are the destructive ones on purpose, so on
 * the unfixed tree this script deletes the branches it is checking nobody
 * deleted.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** What an obeyed command would move: the issue queue, and the local refs. */
const inventory = () => ({
  issues: [
    ...readdirSync(join(ROOT, '.github', 'issues')),
    ...readdirSync(join(ROOT, '.github', 'issues', 'archive')),
  ]
    .sort()
    .join(' '),
  branches: execFileSync('git', ['for-each-ref', '--format=%(refname:short)', 'refs/heads'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim(),
});

/**
 * Run a script the way a shell would, with no token in the environment: a help
 * flag must not need the API, and a case that needed one would fail here for the
 * wrong reason.
 */
const run = (script, argv) => {
  try {
    return {
      out: execFileSync(process.execPath, [join(ROOT, '.github', 'scripts', script), ...argv], {
        cwd: ROOT,
        encoding: 'utf8',
        env: { ...process.env, GITHUB_TOKEN: '', GH_TOKEN: '' },
        stdio: ['ignore', 'pipe', 'pipe'],
      }),
      code: 0,
    };
  } catch (e) {
    return { out: `${e.stdout ?? ''}${e.stderr ?? ''}`, code: e.status ?? 1 };
  }
};

const CASES = [
  ['flow issue archive --help', 'flow.mjs', ['issue', 'archive', '--help'], 'flow issue archive'],
  ['flow clean --help', 'flow.mjs', ['clean', '--help'], 'flow clean'],
  ['maintain fix --help', 'maintain.mjs', ['fix', '--help'], 'maintain fix'],
];

const before = inventory();
let obeyed = 0;

for (const [label, script, argv, documented] of CASES) {
  const { out, code } = run(script, argv);
  const answered = code === 0 && out.includes(documented);
  if (!answered) obeyed += 1;
  process.stdout.write(`${answered ? 'answered' : 'OBEYED  '}  ${label}${answered ? '' : `  (exit ${code})`}\n`);
}

const after = inventory();
const moved = [];
if (after.issues !== before.issues) moved.push('the issue queue');
if (after.branches !== before.branches) moved.push('the local branches');

process.stdout.write(`\nnot obeyed : ${CASES.length - obeyed} of ${CASES.length}\n`);
process.stdout.write(`tree moved : ${moved.length ? moved.join(', ') : 'not at all'}\n`);
process.exit(obeyed || moved.length ? 1 : 0);