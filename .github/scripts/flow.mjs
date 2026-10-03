#!/usr/bin/env node
/**
 * `flow` - the whole contribution cycle, in one tool, in order.
 *
 *   flow                      run the menu: the cycle, one decision at a time
 *   flow status               where am I: branch, issue, release, npm, PR
 *
 *   flow issue list           the local registry and its GitHub numbers
 *   flow issue new            declare an issue locally, from a template or blank
 *   flow issue link <n>       adopt an issue that already exists on GitHub
 *   flow issue sync           create/update the declared issues on GitHub
 *   flow issue archive        move closed issues into .github/issues/archive/
 *   flow release              declare the bump and the summary (the one changeset)
 *   flow release sync         regenerate .changeset/release.md from the declaration
 *   flow release consolidate  fold every existing changeset into the single one
 *   flow release check        drift between the declaration and the changeset (CI)
 *   flow release status       does npm have this version? what did Release decide?
 *   flow branch [name]        create and switch to a branch
 *   flow commit               commit with the `Issues:` trailer
 *   flow push                 push and set the upstream
 *   flow link [pr]            write `Closes #n` into the pull request
 *   flow pr                   open the pull request
 *
 * The sibling tools that live next door, reachable the same way:
 *
 *   flow maintain [what]      what the cycle leaves behind: list, fix, issues, prs
 *   flow labels [--check]     the label registry and the labeler generated from it
 *
 * Every step is also usable on its own, and the menu is a front end over those
 * same functions rather than a second code path. With no terminal there is no
 * menu at all: the cycle runs in order, as it always did, because a wizard that
 * hangs in a pipeline is worse than one that guesses.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import {
  ROOT,
  OWNER,
  REPO,
  api,
  currentBranch,
  ensurePullRequest,
  findPullRequest,
  getIssue,
  git,
  gitTry,
  isPullRequest,
  requireToken,
  token,
} from './lib/github.mjs';
import * as prompt from './lib/prompt.mjs';
import {
  archiveFile,
  archivedIds,
  readNumbers,
  readRegistry,
  reconcile,
  slugify,
  uniqueSlug,
  writeIssue,
  writeNumbers,
} from './lib/registry.mjs';
import {
  ALL_KINDS,
  CHANGESET,
  DECLARATION,
  checkDrift,
  consolidate,
  readChangesets,
  readDeclaration,
  renderChangeset,
  resetDeclaration,
  writeChangeset,
  writeDeclaration,
} from './lib/release.mjs';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const TEMPLATES = join(ROOT, '.github', 'flow', 'templates.yml');
const STATE = join(ROOT, '.github', 'flow', '.state.json');

/**
 * `--name value`, `--name=value` and bare `--flag`.
 *
 * Flags exist so every step is scriptable and testable without a terminal; the
 * wizard is the interactive front end over exactly the same functions, not a
 * separate code path.
 *
 * The value of a flag is consumed here rather than left in the positional list,
 * so `flow pr --title "Fix it"` does not read "Fix it" as the title *and* as a
 * positional argument - which is how `flow issue link --template x 42` would
 * silently link the wrong thing.
 */
const VALUE_FLAGS = new Set([
  'template',
  'title',
  'summary',
  'labels',
  'bump',
  'subject',
  'message',
  'body-file',
  'name',
  'topic',
]);

const argv = process.argv.slice(2);
const flags = {};
const args = [];
for (let i = 0; i < argv.length; i += 1) {
  const token = argv[i];
  if (!token.startsWith('--')) {
    args.push(token);
    continue;
  }
  const eq = token.indexOf('=');
  if (eq !== -1) {
    flags[token.slice(2, eq)] = token.slice(eq + 1);
    continue;
  }
  const name = token.slice(2);
  if (VALUE_FLAGS.has(name) && argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) {
    flags[name] = argv[i + 1];
    i += 1;
  } else {
    flags[name] = true;
  }
}

const opt = (name, fallback = undefined) => flags[name] ?? fallback;

/**
 * `--help` is a flag, not a command.
 *
 * The loop above files every `--x` under `flags`, so `args` can never hold
 * `--help` - which made the `case '--help'` in the dispatcher below unreachable,
 * and turned `flow issue archive --help` into a real archive of every closed
 * issue. A flag nobody taught the parser has to be answered, never obeyed.
 */
const wantsHelp = () => flags.help === true || flags.h === true;

const { ask, select, confirm, step, info, warn, bad, good } = prompt;

// --- per-branch scratch state (gitignored) ----------------------------------
// Which issue this branch is about, what to call it. Keeping it in a file is
// what lets `issue new` feed `commit` and `pr` without being asked twice.
const readState = () => {
  const branch = currentBranch();
  if (!existsSync(STATE)) return { branch, issues: [] };
  try {
    const s = JSON.parse(readFileSync(STATE, 'utf8'));
    return s.branch === branch ? s : { branch, issues: [] };
  } catch {
    return { branch, issues: [] };
  }
};
const writeState = (s) => writeFileSync(STATE, `${JSON.stringify(s, null, 2)}\n`, 'utf8');

/** The published package: its name, and the version this checkout believes in. */
const pkgJson = () => JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const templates = () => {
  const doc = yaml.load(readFileSync(TEMPLATES, 'utf8')) ?? {};
  return doc.templates ?? {};
};

const loadTemplates = () => templates();

// --- release (the one changeset) --------------------------------------------
const cmdRelease = async () => {
  const current = readDeclaration();
  info(`current: bump=${current.bump}${existsSync(CHANGESET) ? '' : ', .changeset/release.md missing'}`);

  const flagBump = opt('bump');
  if (flagBump && !ALL_KINDS.includes(flagBump)) {
    bad(`unknown bump "${flagBump}" - expected ${ALL_KINDS.join(', ')}`);
    process.exitCode = 2;
    return;
  }
  const bump = flagBump
    ? { value: flagBump }
    : await select(
        'Version bump?',
        ALL_KINDS.map((k) => ({ label: k, value: k })),
        {
          defaultIndex: Math.max(0, ALL_KINDS.indexOf(current.bump)),
          hint: '  none = nothing to release this cycle',
        }
      );

  let summary = current.summary;
  if (bump.value !== 'none') {
    summary =
      opt('summary') ??
      (await ask('Summary (one line per change; edit the file for the detail)', {
        default: current.summary.split('\n')[0],
      }));
    if (!summary.trim()) {
      bad(`bump "${bump.value}" needs a summary - the changelog entry comes from it`);
      process.exitCode = 2;
      return;
    }
  } else {
    summary = '';
  }
  writeDeclaration({ bump: bump.value, summary });
  writeChangeset(renderChangeset({ bump: bump.value, summary }));
  if (bump.value === 'none') {
    good('bump: none - .changeset/ holds no changeset');
  } else {
    good(`bump: ${bump.value} - .changeset/release.md written`);
  }
};

const cmdReleaseSync = () => {
  const declaration = readDeclaration();
  writeChangeset(renderChangeset(declaration));
  good(`declaration ${declaration.bump} -> ${existsSync(CHANGESET) ? '.changeset/release.md' : 'no changeset'}`);
};

/**
 * The gate a human would otherwise run by hand and forget.
 *
 * It is a gate, not a formatter: nothing here rewrites a file, so a failure
 * always means "look at this", never "it fixed itself".
 */
const cmdVerify = async () => {
  const checks = [
    // `node` explicitly: a bare `.mjs` path is not executable on Windows.
    ['the single changeset is in step with its declaration', ['node', '.github/scripts/flow.mjs', 'release', 'check']],
    ['the generated files match the registries', ['npm', 'run', '--silent', 'design:gen:check']],
    ['the registries validate', ['npm', 'run', '--silent', 'design:check']],
    ['types', ['npx', '--no-install', 'tsc', '--noEmit']],
  ];
  let failed = 0;
  for (const [what, argv] of checks) {
    info(`checking ${what}...`);
    // Captured, and only shown on failure: a passing `npm run` still writes to
    // stderr, and interleaving that with the checklist makes both unreadable.
    const r = spawnSync(argv[0], argv.slice(1), {
      cwd: ROOT,
      shell: true,
      encoding: 'utf8',
    });
    if (r.status === 0) {
      good(what);
      continue;
    }
    bad(`failed: ${what}`);
    const noise = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
    if (noise)
      info(
        noise
          .split('\n')
          .slice(-12)
          .map((l) => `    ${l}`)
          .join('\n')
      );
    failed += 1;
  }
  if (failed) {
    bad(`${failed} check(s) failed`);
    process.exitCode = 1;
    return false;
  }
  good(`all ${checks.length} checks passed`);
  return true;
};

/** End the cycle after `changeset version` consumed the changeset.
 *
 * Wired into `npm run version:bump`, which is what the release workflow runs to
 * build the version pull request. Leaving the declaration at `patch` while the
 * generated file has been consumed is the state that made both the version pull
 * request and main fail their own checks.
 */
const cmdReleaseReset = () => {
  const before = readDeclaration();
  resetDeclaration();
  good(`bump ${before.bump} -> none, .changeset/release.md removed`);
  info('the next cycle starts with `flow release`');
};

const cmdReleaseConsolidate = () => {
  const { ok, broken, merged, bump, summary } = consolidate();
  if (!ok) {
    bad(`${broken.length} changeset(s) cannot be read, nothing was changed:`);
    for (const b of broken) bad(`  .changeset/${b.file}: ${b.why}`);
    process.exitCode = 1;
    return;
  }
  writeDeclaration({ bump, summary });
  writeChangeset(renderChangeset({ bump, summary }));
  good(`${merged} changeset(s) folded into one (bump: ${bump})`);
  info('the merged summary is the concatenation of the originals - trim it if it reads like a pile');
};

const cmdReleaseCheck = () => {
  const problems = checkDrift();
  if (problems.length) {
    bad(`${problems.length} problem(s):`);
    for (const p of problems) bad(`  - ${p}`);
    process.exitCode = 1;
    return;
  }
  const declaration = readDeclaration();
  good(`one changeset, bump: ${declaration.bump}, in step with ${DECLARATION.split(/[\\/]/).slice(-2).join('/')}`);
};

/**
 * What the registry holds, in one request, without ever throwing.
 *
 * `flow status` and `flow release status` both ask, and the reason they ask is
 * that a green run is silent: versions 2.0.1 to 2.0.3 were never published and
 * nothing in the repository said so for weeks. "Not on npm" and "cannot tell"
 * are different answers and both are information, so the failure is a value
 * here rather than an exception.
 */
const npmState = async (name) => {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return { versions: {}, times: {}, latest: null }; // never published
    if (!res.ok) return { error: `the registry answered ${res.status}` };
    const doc = await res.json();
    return {
      versions: doc.versions ?? {},
      times: doc.time ?? {},
      latest: doc['dist-tags']?.latest ?? null,
    };
  } catch (e) {
    return { error: e?.cause?.code ?? e?.name ?? 'unreachable' };
  }
};

/** The name of the step a failed Release run died in, or null if it cannot be read. */
const failedStep = async (runId) => {
  try {
    const { jobs } = await api(`/actions/runs/${runId}/jobs?per_page=50`);
    return jobs.flatMap((j) => j.steps ?? []).find((s) => s.conclusion === 'failure')?.name ?? null;
  } catch {
    return null;
  }
};

/**
 * The question a green tick does not answer: did the publish happen?
 *
 * It reads the same facts the workflow's preflight reads - the declaration, the
 * pending changesets, the version, the `## <version>` changelog entry that is
 * the actual publish gate - plus what npm says and what the last runs decided,
 * and ends with one line saying what is going to happen.
 *
 * Always exits 0. Drift here is a state of the chain, not a failure, and a
 * status command that exits non-zero halfway through is one nobody pipes.
 */
const cmdReleaseStatus = async () => {
  const declaration = readDeclaration();
  const { found, broken } = readChangesets();
  // What `changeset version` will consume. `release.md` is the canonical single
  // changeset, and `readChangesets` deliberately skips it - that reader exists to
  // surface the strays - so the count answered "none pending" for the ordinary
  // state, a declared bump with its generated file in place. The verdict below
  // then reported an error for exactly the state `flow release check` had just
  // called correct: the same two tools disagreeing about `.changeset/` that the
  // `status` line was fixed for.
  const pending = [...(existsSync(CHANGESET) ? ['release.md'] : []), ...found.map((f) => f.file)];
  const pkg = pkgJson();
  const local = pkg.version;
  const state = await npmState(pkg.name);

  info(`branch       ${currentBranch()}`);
  info(
    `declaration  bump: ${declaration.bump}${declaration.summary ? ` - ${declaration.summary.split('\n')[0]}` : ''}`
  );
  info(
    `changesets   ${
      pending.length ? `${pending.length} pending: ${pending.join(', ')}` : 'none pending'
    }${broken.length ? `   [${broken.length} unreadable]` : ''}`
  );
  info(`package      ${local}`);

  if (state.error) {
    info(`npm          (could not be reached: ${state.error})`);
  } else if (!state.versions[local]) {
    info(`npm          ${local} is NOT published (latest: ${state.latest ?? 'nothing at all'})`);
  } else {
    const when = String(state.times?.[local] ?? '').slice(0, 10);
    info(
      `npm          ${local} published${when ? ` ${when}` : ''}${
        local === state.latest ? '' : ` (latest is ${state.latest})`
      }`
    );
  }

  // The gate itself, not an opinion about it: `changeset version` writes
  // `## <version>`, and the workflow refuses to publish without that line.
  const changelog = gitTry('git show HEAD:CHANGELOG.md') ?? '';
  const escaped = local.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const gated = new RegExp(`^## ${escaped}$`, 'm').test(changelog);
  info(
    `changelog    ${
      gated ? `## ${local} present - the publish gate would pass` : `no "## ${local}" entry - the gate would refuse`
    }`
  );

  try {
    const runs = await api('/actions/workflows/release.yml/runs?per_page=3');
    const described = [];
    for (const run of runs.workflow_runs) {
      const conclusion = run.conclusion ?? 'running';
      if (conclusion === 'failure' || conclusion === 'timed_out') {
        const step = await failedStep(run.id);
        described.push(`${run.run_number} failure${step ? ` at "${step}"` : ''}`);
      } else {
        described.push(`${run.run_number} ${conclusion}`);
      }
    }
    info(`last runs    ${described.join(', ') || '(none)'}`);
  } catch (e) {
    info(`last runs    (could not be listed: ${e.message.split('\n')[0]})`);
  }

  info('');
  const verdict = () => {
    if (state.error)
      return ['wait', `npm could not be reached (${state.error}) - cannot tell whether ${local} is published`];
    if (!state.versions[local]) return ['bad', `${local} is not on npm - a Release run still owes that publish`];
    if (pending.length)
      return ['wait', `${pending.length} change(s) declared - merging "chore: version packages" is what publishes next`];
    if (declaration.bump !== 'none')
      return [
        'bad',
        `the declaration says ${declaration.bump} but .changeset/ holds no changeset - run \`flow release sync\``,
      ];
    return ['ok', `npm has ${local} and nothing is declared - nothing to publish`];
  };
  const [level, text] = verdict();
  if (level === 'ok') good(text);
  else if (level === 'wait') warn(text);
  else bad(text);
  info(`https://github.com/${OWNER}/${REPO}/actions/workflows/release.yml`);
};

// --- git -------------------------------------------------------------------
const cmdBranch = async () => {
  const given = args[1] ?? opt('name') ?? (opt('topic') ? slugify(opt('topic')) : undefined);
  // Read before anything else. `readState` is branch-scoped - it discards a file
  // that describes a different branch - and `currentBranch` answers for the
  // branch that is checked out now. Asking either of them after `git switch -c`
  // asks about the branch that was just created, which is how this looked correct
  // and carried nothing.
  const from = currentBranch();
  const name =
    given ??
    (await ask('Branch name', {
      // Never `main`: the current branch is the natural default everywhere else,
      // and here it would only ever answer "branch main already exists".
      default: slugify(await ask('What is it about?', { default: from === 'main' ? '' : from })),
    }));
  if (gitTry(`git rev-parse --verify ${name}`)) {
    bad(`branch ${name} already exists - switch to it, or pick another name`);
    process.exitCode = 2;
    return;
  }
  if (!name) {
    bad('a branch needs a name');
    process.exitCode = 2;
    return;
  }
  const state = readState();
  git(`git switch -c ${name}`);

  // Issues declared on `main` are work that exists nowhere else yet, and the new
  // branch is cut from this same working tree, so they belong to it. Issues
  // declared on another branch do not travel: that branch keeps them, and this
  // one starts clean.
  //
  // This is what makes the documented order work. CONTRIBUTING runs `issue` at
  // step 1 and `branch` at step 3, and until now step 3 threw step 1 away
  // silently - so a cycle followed in order ended on "no issue declared for this
  // branch", with the scratch file as the only place the link still existed.
  const carried = from === 'main' ? state.issues : [];
  writeState({ ...state, branch: name, issues: carried });
  if (carried.length) info(`carried ${carried.length} issue(s) declared on main`);
  good(`on ${name}`);
};

const cmdCommit = async () => {
  const state = readState();
  const registry = readRegistry();
  const linked = state.issues.filter((id) => registry.some((i) => i.id === id));
  if (!linked.length) {
    warn('no issue declared for this branch - `flow issue new` first, or `flow issue link <n>`');
    if (!opt('allow-no-issue') && !(await confirm('Commit anyway?', { default: false }))) {
      process.exitCode = 2;
      return;
    }
  }

  const bodyFileIn = opt('body-file');
  const fileBody = bodyFileIn && existsSync(bodyFileIn) ? readFileSync(bodyFileIn, 'utf8').replace(/\s+$/, '') : '';

  // With `--body-file` and no `--subject`, the first line of the file is the
  // subject and is removed from the body. Keeping it in both is how you get a
  // commit whose subject is repeated as its own first paragraph.
  let body = fileBody;
  let subject = opt('subject') ?? opt('message');
  if (!subject && fileBody) {
    const lines = fileBody.split('\n');
    const at = lines.findIndex((l) => l.trim());
    if (at !== -1) {
      subject = lines[at].trim();
      body = lines
        .slice(at + 1)
        .join('\n')
        .replace(/^\s*\n/, '')
        .replace(/\s+$/, '');
    }
  }
  subject ??= await ask('Subject', { default: state.subject ?? '' });
  if (!subject) {
    bad('a commit needs a subject');
    process.exitCode = 2;
    return;
  }

  // The trailer is added here rather than typed, so it always matches the
  // issues actually declared for this branch.
  const trailer = linked.length ? `\n\nIssues: ${linked.join(', ')}` : '';
  const msgFile = join(ROOT, '.git', 'FLOW_COMMIT_MSG');
  writeFileSync(msgFile, `${subject.trim()}${body ? `\n\n${body}` : ''}${trailer}\n`, 'utf8');

  git('git add -A');
  try {
    git(`git commit -F "${msgFile}"`);
  } catch {
    bad('nothing to commit');
    process.exitCode = 1;
    return;
  }
  const next = readState();
  delete next.subject;
  writeState(next);
  good(`committed ${gitTry('git rev-parse --short HEAD')}`);
  if (linked.length) info(`Issues: ${linked.join(', ')}`);
};

const cmdPush = () => {
  const branch = currentBranch();
  const upstream = gitTry('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
  // A branch cut from a remote one (`git checkout -b x origin/main`) inherits
  // `origin/main` as its upstream, and a bare `git push` then refuses because
  // the upstream name does not match the branch. Only reuse an upstream that
  // actually points at this branch.
  const usable = upstream === `origin/${branch}`;
  // Reporting "pushed" for a branch that was already in step is a lie the cycle
  // then acts on: it made a `flow push` step look like progress when there was
  // nothing to send.
  const ahead = Number(gitTry(`git rev-list --count @{u}..HEAD`)?.trim() ?? 0);
  if (upstream && ahead === 0) {
    info(`${branch} is already in step with ${upstream} - nothing to push`);
    return;
  }
  try {
    git(usable ? 'git push' : `git push -u origin ${branch}`);
  } catch (e) {
    bad(`push failed: ${String(e.stderr ?? e.message).split('\n')[0]}`);
    process.exitCode = 1;
    return;
  }
  good(`pushed ${branch}${usable ? '' : '  (upstream set)'}`);
};

// --- issues ----------------------------------------------------------------
const cmdIssueList = () => {
  const registry = readRegistry();
  const numbers = readNumbers();
  const state = readState();
  info(`declared: ${registry.length} | linked: ${Object.keys(numbers).length}`);
  info('');
  for (const issue of registry) {
    const flags = [];
    if (numbers[issue.id]) flags.push(`#${numbers[issue.id]}`);
    if (state.issues.includes(issue.id)) flags.push('this branch');
    info(
      `  ${String(numbers[issue.id] ?? 'unlinked').padEnd(9)} ${issue.id.padEnd(26)} ${issue.title.slice(0, 52)}${
        flags.length ? `  \x1b[2m[${flags.join(', ')}]\x1b[0m` : ''
      }`
    );
  }
  const archived = archivedIds().length;
  if (archived) {
    info('');
    info(`${archived} archived issue(s) in .github/issues/archive/ - closed work, out of this list on purpose`);
  }
};

const cmdIssueNew = async () => {
  const registry = readRegistry();
  const taken = new Set([...registry.map((i) => i.id), ...archivedIds()]);
  const defs = loadTemplates();
  const names = Object.keys(defs);

  const flagTemplate = opt('template');
  if (flagTemplate && !defs[flagTemplate]) {
    bad(`unknown template "${flagTemplate}" - available: ${names.join(', ')}`);
    process.exitCode = 2;
    return null;
  }
  const picked = flagTemplate
    ? { value: flagTemplate }
    : await select(
        'Which template?',
        names.map((n) => ({ label: n, value: n })),
        {
          hint: '  (blank = no template, just a title)',
        }
      );
  const template = picked ? defs[picked.value] : { title: '', labels: [], body: '{{summary}}' };

  const title = opt('title') ?? (await ask('Title', { default: template.title }));
  if (!title) {
    bad('an issue needs a title');
    process.exitCode = 2;
    return null;
  }
  // A template title is a prefix ("[Feature]: "), so pressing Enter on the
  // prompt yields a truthy string whose informative part is empty. Writing that
  // out produced `issue.yml` with the title `"[Feature]: "` and an empty body -
  // a file that passes every later check because it is well formed and means
  // nothing. The prefix is not a title.
  const bare = title.replace(/^\[[^\]]+\]:\s*/, '').trim();
  if (!bare) {
    bad(`"${title}" is only the template prefix - an issue needs a title of its own`);
    process.exitCode = 2;
    return null;
  }
  const summary =
    opt('summary') ??
    (await ask('One-line summary (the rest of the body is yours to edit)', {
      hint: '  written to .github/issues/<id>.yml - edit it afterwards for the detail',
    }));
  const labels = opt('labels')
    ? opt('labels')
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
    : template.labels ?? [];

  const id = uniqueSlug(slugify(bare), taken);
  const file = writeIssue(
    {
      id,
      title,
      labels,
      body: String(template.body).replace('{{summary}}', summary || bare),
    },
    'Declared locally. `flow issue sync` creates it on GitHub and records the number.'
  );
  const state = readState();
  state.issues = [...new Set([...state.issues, id])];
  writeState(state);
  good(`.github/issues/${file}`);
  info(`id: ${id}${labels.length ? `  labels: ${labels.join(', ')}` : ''}`);
  return id;
};

const cmdIssueLink = async (number) => {
  if (!Number.isInteger(number)) {
    bad('usage: flow issue link <github-issue-number>');
    process.exitCode = 2;
    return null;
  }
  const registry = readRegistry();
  const numbers = readNumbers();

  // Already declared *and* numbered here, so re-tying this branch to it needs
  // nothing but the local registry - no token, no request. The tracker call
  // comes after, because adopting an issue nobody declared locally does need it.
  //
  // Declared is not the same as linked to *this* branch, and a branch that lost
  // the association had no way back short of editing the scratch file by hand.
  // Typing the number is the request; honour it either way.
  const existing = registry.find((i) => numbers[i.id] === number);
  if (existing) {
    const state = readState();
    if (state.issues.includes(existing.id)) {
      info(`#${number} is already declared locally as "${existing.id}".`);
      return existing.id;
    }
    state.issues = [...new Set([...state.issues, existing.id])];
    writeState(state);
    good(`#${number} is already declared as "${existing.id}" - now linked to ${state.branch || currentBranch()}`);
    return existing.id;
  }

  await requireToken('flow issue link');
  const remote = await getIssue(number);
  if (isPullRequest(remote)) {
    bad(`#${number} is a pull request. GitHub shares one numbering, so only an issue can be closed.`);
    process.exitCode = 2;
    return null;
  }
  const id = uniqueSlug(
    slugify(remote.title.replace(/^\[[^\]]+\]:\s*/, '')),
    new Set([...registry.map((i) => i.id), ...archivedIds()])
  );
  writeIssue(
    {
      id,
      title: remote.title,
      labels: remote.labels.map((l) => l.name).filter((l) => !l.startsWith('size/')),
      body: remote.body ?? '',
    },
    `Adopted from GitHub issue #${number} on ${
      remote.created_at?.slice(0, 10) ?? 'the tracker'
    }. Edit the body here; \`flow issue sync\` never overwrites a GitHub body, only the title and the labels.`
  );
  numbers[id] = number;
  writeNumbers(numbers);
  const state = readState();
  state.issues = [...new Set([...state.issues, id])];
  writeState(state);
  good(`.github/issues/${id}.yml -> #${number}`);
  return id;
};

const cmdIssueSync = async () => {
  await requireToken('flow issue sync');
  const registry = readRegistry();
  const { repaired, problems } = await reconcile(registry, { apply: true });
  for (const r of repaired) good(r);
  for (const p of problems) bad(p);
  if (problems.length) process.exitCode = 1;
  else info(`${registry.length} issue(s) in step with GitHub.`);
};

/** Read-only counterpart of `sync`; this is what CI runs. */
const cmdIssueCheck = async () => {
  await requireToken('flow issue check');
  const registry = readRegistry();
  if (!registry.length) {
    good('issues: nothing declared - the registry holds no open work.');
    return;
  }
  const { problems } = await reconcile(registry, { apply: false });
  if (problems.length) {
    bad(`issues: ${problems.length} problem(s):`);
    for (const p of problems) bad(`  - ${p}`);
    process.exitCode = 1;
    return;
  }
  good(`issues: ${registry.length} declared issue(s) consistent with GitHub.`);
};

/**
 * Move closed issues out of the registry.
 *
 * The queue is what `flow issue check` spends one API call per declared issue
 * on, what `flow pr` reads to build `Closes #n`, and what a reader opens to see
 * what is in flight. A closed ticket is none of those things - it is history,
 * and it belongs one directory down.
 *
 * `.numbers.json` is deliberately left alone: it is what stops an id being
 * handed out twice, and the id keeps owning its number long after the file
 * moves. `flow issue new` refuses to reuse an archived id for the same reason.
 */
const cmdIssueArchive = async (ids) => {
  await requireToken('flow issue archive');
  const registry = readRegistry();
  const numbers = readNumbers();
  const already = new Set(archivedIds());
  const wanted = ids.length ? ids : registry.map((i) => i.id);
  const moved = [];
  const kept = [];

  for (const id of wanted) {
    const issue = registry.find((i) => i.id === id);
    if (!issue) {
      kept.push(`${id}: ${already.has(id) ? 'already archived' : 'no declared file'}`);
      continue;
    }
    const number = numbers[id];
    // Verified, not assumed: `isPullRequest` first, because GitHub shares one
    // numbering, and an id mapped to a pull request is a bug worth reporting.
    if (number) {
      const remote = await getIssue(number);
      if (isPullRequest(remote)) {
        kept.push(`${id}: #${number} is a pull request, not an issue`);
        continue;
      }
      if (remote.state !== 'closed') {
        kept.push(`${id}: #${number} is still open`);
        continue;
      }
    }
    const where = archiveFile(issue.file);
    moved.push(id);
    good(`${where}${number ? `  -> #${number}` : '  (never synced)'}`);
  }

  // The branch scratch file points at declared issues; an archived id has no
  // file any more, and leaving it there is the accumulation `maintain` reports.
  const state = readState();
  const forgotten = state.issues.filter((id) => moved.includes(id));
  if (forgotten.length) {
    state.issues = state.issues.filter((id) => !moved.includes(id));
    writeState(state);
    info(`forgotten ${forgotten.length} archived id(s) from the scratch state of ${state.branch}`);
  }

  for (const k of kept) warn(k);
  if (!moved.length && !kept.length) info('nothing to archive: no issue is declared.');
  else info(`${moved.length} archived, ${kept.length} left in place.`);
  if (kept.length) process.exitCode = 1;
};

// --- pull request ----------------------------------------------------------
/**
 * The `Closes #n` line lives between these two markers.
 *
 * The markers are the whole point: without them `flow link` cannot tell its own
 * line from one a human wrote, so adding an issue to an existing pull request
 * appends a second `Closes` line and GitHub acts on only one of them. The first
 * version of this file used a single trailing marker and never wrote it in the
 * common path, which made it dead code.
 */
const LINK_START = '<!-- foundation:linked-issues:start -->';
const LINK_END = '<!-- foundation:linked-issues:end -->';

const linkBlock = (issues) => `${LINK_START}\nCloses ${issues.map((n) => `#${n}`).join(', ')}\n${LINK_END}`;

/** Replace flow's own `Closes` block, or put one in front of the body. */
const withLinkBlock = (raw, block) => {
  const body = raw ?? '';
  const marked = new RegExp(`${LINK_START}[\\s\\S]*?${LINK_END}`);
  if (marked.test(body)) return body.replace(marked, block).replace(/\n*$/, '\n');
  // A pull request opened before the markers existed: replace the bare line
  // rather than stacking a second one on top of it.
  const bare = body.match(/^\s*Closes[^\n]*\n/);
  const rest = (bare ? body.slice(bare[0].length) : body).replace(/^\s*\n/, '').replace(/\s+$/, '');
  return `${block}\n\n${rest}\n`;
};

const compareUrl = (title, body) => {
  const query = new URLSearchParams({ expand: '1', title, body }).toString();
  return `https://github.com/${OWNER}/${REPO}/compare/main...${currentBranch()}?${query}`;
};

/**
 * Write `Closes #n` into the pull request, from local ids.
 *
 * The number is resolved, never typed: GitHub shares one numbering between
 * issues and pull requests, so a wrong number silently closes nothing.
 */
const cmdLink = async () => {
  const state = readState();
  const ids = args.length > 1 ? args.slice(1) : state.issues;
  if (!ids.length) {
    bad('no issue for this branch - `flow issue new` or `flow issue link <n>` first');
    process.exitCode = 2;
    return;
  }
  await requireToken('flow link');

  const registry = readRegistry();
  const numbers = readNumbers();
  const unknown = ids.filter((id) => !registry.some((i) => i.id === id));
  if (unknown.length) {
    bad(`unknown local id(s): ${unknown.join(', ')} - see \`flow issue list\``);
    process.exitCode = 2;
    return;
  }
  const resolved = [];
  for (const id of ids) {
    const n = numbers[id];
    if (!n) {
      bad(`${id} is not synced yet - \`flow issue sync\``);
      process.exitCode = 2;
      continue;
    }
    const issue = await getIssue(n);
    if (isPullRequest(issue)) {
      bad(`${id}: #${n} is a pull request, "Closes" needs an issue`);
      process.exitCode = 2;
      continue;
    }
    resolved.push(n);
  }
  if (process.exitCode) return;

  const pr = args[1] && /^\d+$/.test(args[1]) ? await api(`/pulls/${args[1]}`) : await findPullRequest();
  if (!pr) {
    bad(`no open pull request for ${currentBranch()} - \`flow pr\` first`);
    process.exitCode = 2;
    return;
  }
  const body = withLinkBlock(pr.body, linkBlock(resolved));
  const line = resolved.map((n) => `#${n}`).join(', ');
  if (body !== (pr.body ?? '')) {
    await api(`/pulls/${pr.number}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    good(`#${pr.number} -> Closes ${line}`);
  } else {
    good(`#${pr.number} already carries Closes ${line}`);
  }
};

const cmdPr = async () => {
  const state = readState();
  const registry = readRegistry();
  const numbers = readNumbers();
  const declaration = readDeclaration();

  const linked = state.issues.filter((id) => registry.some((i) => i.id === id));
  const resync = linked.filter((id) => !numbers[id]);
  const closes = linked.filter((id) => numbers[id]).map((id) => numbers[id]);
  const title = args[1] ?? opt('title') ?? (await ask('Pull request title', { default: state.title ?? '' }));

  const sections = [];
  if (closes.length) sections.push(linkBlock(closes));
  if (declaration.bump !== 'none' && declaration.summary) {
    sections.push(`## What this changes\n\n${declaration.summary}`);
  }
  const body = sections.join('\n\n');

  // No token: do not leave the contributor with a pushed branch and no way
  // forward. The compare URL opens the same pull request, pre-filled.
  if (!token()) {
    warn('no token, so the pull request cannot be opened for you');
    if (resync.length) warn(`${resync.join(', ')} is not synced yet - run \`flow issue sync\` first`);
    info('');
    info('Open it with this URL; the title and the body are already filled in:');
    info('');
    info(`  ${compareUrl(title, body)}`);
    info('');
    info('Or set GITHUB_TOKEN and run `npm run flow -- pr` instead.');
    process.exitCode = 2;
    return;
  }

  if (resync.length) {
    warn(`${resync.join(', ')} has no GitHub number yet - run \`flow issue sync\` first, or the link will be missing`);
  }
  const opened = await ensurePullRequest({ title, body }).catch((e) => {
    if (/\/pulls -> 422/.test(e.message)) {
      bad('GitHub refused the pull request: the branch is not on the remote yet - run `flow push` first');
    } else {
      bad(e.message.split('\n')[0]);
    }
    process.exitCode = 1;
    return null;
  });
  if (!opened) return;
  const { pr, created } = opened;
  state.title = title;
  writeState(state);
  good(`${created ? 'opened' : 'updated'} #${pr.number}: ${title}`);
  info(`https://github.com/${OWNER}/${REPO}/pull/${pr.number}`);
};

// --- merging and tidying ---------------------------------------------------
const METHODS = ['merge', 'squash', 'rebase'];

/**
 * Merge the pull request for this branch.
 *
 * It refuses while a check is failing: merging a red pull request is almost
 * never what was meant, and `--force` is there for when it is.
 *
 * The default method is `merge`, not `squash`. Squashing rewrites the message
 * of every commit it collapses - which is how the release preflight lost the
 * `chore: version packages` subject it was looking for.
 */
const cmdMerge = async () => {
  const method = opt('method', 'merge');
  if (!METHODS.includes(method)) {
    bad(`unknown method "${method}" - expected ${METHODS.join(', ')}`);
    process.exitCode = 2;
    return;
  }
  await requireToken('flow merge');
  const pr = args[1] && /^\d+$/.test(args[1]) ? await api(`/pulls/${args[1]}`) : await findPullRequest();
  if (!pr) {
    bad(`no open pull request for ${currentBranch()}`);
    process.exitCode = 2;
    return;
  }
  if (pr.draft) {
    bad(`#${pr.number} is still a draft`);
    process.exitCode = 2;
    return;
  }

  const runs = await api(`/commits/${pr.head.sha}/check-runs?per_page=100`);
  const failing = runs.check_runs.filter((c) => c.conclusion === 'failure' || c.conclusion === 'timed_out');
  const pending = runs.check_runs.filter((c) => !c.conclusion);
  const passing = runs.check_runs.length - failing.length - pending.length;
  info(
    `#${pr.number}: ${runs.check_runs.length} check(s) - ${passing} ok, ${failing.length} failing, ${pending.length} pending`
  );

  if (failing.length) {
    bad(`failing: ${failing.map((c) => c.name).join(', ')}`);
    if (!opt('force')) {
      bad('refusing to merge - pass --force to merge anyway');
      process.exitCode = 1;
      return;
    }
    warn('--force: merging over a failing check');
  } else if (pending.length) {
    warn(`still running: ${pending.map((c) => c.name).join(', ')}`);
  }

  const merged = await api(`/pulls/${pr.number}/merge`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merge_method: method }),
  }).catch((e) => {
    bad(e.message.split('\n')[0]);
    process.exitCode = 1;
    return null;
  });
  if (!merged) return;
  good(`#${pr.number} merged with --${method}${merged.sha ? `  ${merged.sha.slice(0, 7)}` : ''}`);

  // Which half of the release this was decides what happens next, and the
  // merge line itself says neither: a version pull request and an ordinary one
  // look identical the moment they are in.
  info('');
  if (pr.head.ref.startsWith('changeset-release/')) {
    good('this WAS the version pull request - merging it is what publishes.');
    info(`watch: https://github.com/${OWNER}/${REPO}/actions/workflows/release.yml`);
  } else {
    info('next: the Release workflow now runs on main.');
    info('  changesets pending -> it opens "chore: version packages"; merging THAT is what publishes.');
    info('  nothing pending     -> nothing will publish, which is what "bump: none" means.');
  }
  info('check: npm run flow -- release status');
};

/**
 * Delete the branches that are finished.
 *
 * A branch is finished when its work is on `main`: locally when it is fully
 * contained in `main`, remotely when its pull request was merged. Anything else
 * is left alone, and `main` and `changeset-release/main` are never touched.
 */
const cmdClean = async () => {
  const keep = new Set(['main', 'changeset-release/main']);
  const here = currentBranch();

  // Token first. This command deletes local refs *and* remote ones, and only the
  // remote half needs the API - so asking for the token where it is first used
  // meant a token-less run came back as a failure with the merged local branches
  // already gone, and nothing in the message saying so.
  await requireToken('flow clean');

  // Fetch before judging. `--is-ancestor <branch> main` answers about the
  // *local* `main`, which lags `origin/main` between pulls, so a run that was
  // otherwise correct stopped short of everything merged since the last one and
  // finished only on a second run - after the fetch at the end of the first.
  // Asking the refreshed remote is the same question put to a current answer.
  gitTry('git fetch --prune origin');
  const base = gitTry('git rev-parse --verify origin/main') ? 'origin/main' : 'main';

  const locals = git('git for-each-ref --format=%(refname:short) refs/heads')
    .split('\n')
    .map((b) => b.trim())
    .filter((b) => b && !keep.has(b) && b !== here);
  const done = locals.filter((b) => gitTry(`git merge-base --is-ancestor ${b} ${base}`) !== null);
  for (const b of done) {
    git(`git branch -D ${b}`);
    good(`deleted local ${b}`);
  }
  info(`local: ${done.length} merged of ${locals.length} candidate(s)`);

  const closed = await api('/pulls?state=closed&per_page=100');
  const mergedRefs = new Set(closed.filter((p) => p.merged_at).map((p) => p.head.ref));

  const remotes = git('git for-each-ref --format=%(refname:short) refs/remotes/origin')
    .split('\n')
    .map((b) => b.trim().replace(/^origin\//, ''))
    .filter((b) => b && !keep.has(b) && b !== 'HEAD' && b !== here);
  const prunable = remotes.filter(
    (b) => mergedRefs.has(b) || gitTry(`git merge-base --is-ancestor origin/${b} ${base}`) !== null
  );
  for (const b of prunable) {
    const gone = await api(`/git/refs/heads/${b}`, { method: 'DELETE' })
      .then(() => true)
      .catch(() => false);
    if (!gone) continue;
    // Drop the remote-tracking ref with it. The fetch at the top of this command
    // happens *before* these deletions, so nothing prunes them afterwards - and
    // `maintain`, which reads `refs/remotes/origin`, reported the branches this
    // command had just deleted as still sitting on the remote.
    gitTry(`git update-ref -d refs/remotes/origin/${b}`);
    good(`deleted origin/${b}`);
  }
  info(`remote: ${prunable.length} of ${remotes.length} candidate(s)`);
  if (!done.length && !prunable.length) info('nothing to clean');
};

const cmdStatus = async () => {
  const branch = currentBranch();
  const state = readState();
  const numbers = readNumbers();
  const declaration = readDeclaration();
  const upstream = gitTry('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
  const ahead = upstream ? gitTry(`git rev-list --count @{u}..HEAD`) : null;
  const dirty = gitTry('git status --porcelain');

  info(`branch       ${branch}${upstream ? ` -> ${upstream}` : ' (no upstream)'}${ahead ? `  [${ahead} ahead]` : ''}`);
  info(
    `issue        ${
      state.issues.length
        ? state.issues.map((id) => `${id}${numbers[id] ? ` (#${numbers[id]})` : ' (unlinked)'}`).join(', ')
        : '(none declared for this branch)'
    }`
  );
  // Only one of the two states is a problem, and which one is not a matter of
  // taste: `checkDrift` requires the changeset to be *absent* when the bump is
  // none, so a `none` declaration with no changeset is the healthy pair - and
  // the most common one, because a cycle that declares nothing is the normal
  // state between releases. Warning "missing" there sent the reader to
  // `flow release sync` to repair what `flow release check` had just called
  // correct, which is two tools disagreeing about an empty `.changeset/`.
  const needsChangeset = declaration.bump !== 'none';
  const inStep = needsChangeset === existsSync(CHANGESET);
  info(
    `release      bump: ${declaration.bump}${
      inStep
        ? ''
        : needsChangeset
        ? '   [changeset missing - flow release sync]'
        : '   [stray .changeset/release.md - flow release reset]'
    }`
  );
  const pkg = pkgJson();
  const npm = await npmState(pkg.name);
  info(
    npm.error
      ? `npm          (could not be reached: ${npm.error})`
      : npm.versions[pkg.version]
      ? `npm          ${pkg.version} published - in step`
      : `npm          ${pkg.version} is NOT published (latest: ${npm.latest ?? 'nothing at all'})`
  );
  info(`working tree ${dirty ? 'uncommitted changes' : 'clean'}`);
  let pr = null;
  try {
    pr = await findPullRequest(branch);
  } catch {
    info('pull request (could not be reached)');
  }
  if (pr) info(`pull request #${pr.number}  ${pr.title}`);
};

/**
 * Everything typed after a tool name, verbatim.
 *
 * `args` holds positionals only - flow parses flags for itself - so a
 * passthrough cannot be built from it. `--sync-labeler` would arrive at the
 * child as nothing at all, and `--title x` would arrive as `--title` alone with
 * the value swallowed, because a parser that has never heard of a flag cannot
 * know whether the next token belongs to it.
 */
const passthrough = (name) => {
  const at = argv.indexOf(name);
  return at === -1 ? [] : argv.slice(at + 1);
};

/**
 * Run one of the sibling tools in `.github/scripts/` as a flow command.
 *
 * `maintain` and `labels` were reachable only as long paths typed by hand, which
 * is the exact problem this CLI exists to solve for the cycle - and the reason
 * they were easy to forget is also the reason they were never found. They stay
 * separate programs: each owns its own arguments, its own exit code and its own
 * reporting, so flow forwards both instead of wrapping them in a second parser
 * that would have to be kept in step with the first.
 *
 * `publish.mjs` is deliberately absent. It publishes to npm, it runs from
 * `release.yml` through `npm run release:ci`, and a menu entry that can publish
 * is a foot-gun wearing a shortcut.
 */
const cmdTool = (name, rest) => {
  const script = join(ROOT, '.github', 'scripts', `${name}.mjs`);
  if (!existsSync(script)) {
    bad(`no tool at .github/scripts/${name}.mjs`);
    process.exitCode = 2;
    return;
  }
  // The menu holds stdin in raw mode through its own readline, and a child that
  // asks a question would fight it for every keypress. Closing first hands the
  // terminal back; the next prompt opens a fresh interface.
  prompt.close();
  const run = spawnSync(process.execPath, [script, ...rest], { cwd: ROOT, stdio: 'inherit' });
  if (run.error) {
    bad(`${name}: ${run.error.message}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = run.status ?? 1;
};

// --- the menu --------------------------------------------------------------
/**
 * The cycle, in order, skipping whatever is already done. The order is the
 * point: an issue exists before the branch that implements it, the release is
 * declared before the commit, and the pull request exists before it is linked.
 *
 * This is what runs when there is no terminal, and what the menu runs when you
 * ask it to run the cycle: one function, not two behaviours.
 */
const runCycle = async () => {
  const total = 8;
  const branch = currentBranch();
  const state = readState();

  // Without a terminal every prompt takes its documented default, which is the
  // right behaviour in a pipeline and a trap behind a human who expected to be
  // asked. Say which one this run is, once, before anything is written.
  if (!prompt.isInteractive()) {
    warn('no terminal: every prompt below takes its default, nothing is asked');
    info('run the steps one by one (flow issue new, flow release, ...) to answer them');
  }

  step(1, total, 'issue');
  if (state.issues.length) {
    info(`already declared for this branch: ${state.issues.join(', ')}`);
  } else {
    const choice = await select('This branch is about...', [
      { label: 'a new issue (declared locally)', value: 'new' },
      { label: 'an issue that already exists on GitHub', value: 'link' },
      { label: 'nothing to declare', value: 'skip' },
    ]);
    if (choice.value === 'new') await cmdIssueNew();
    if (choice.value === 'link') await cmdIssueLink(Number(await ask('GitHub issue number', { default: 0 })));
  }

  step(2, total, 'release (the one changeset)');
  await cmdRelease();
  cmdReleaseSync();

  step(3, total, 'branch');
  if (branch === 'main') {
    await cmdBranch();
  } else {
    info(`already on ${branch}`);
  }

  // Make your changes here, then run `npm run flow` again: this run picks up
  // from the branch, because the steps above are already done.
  if (!gitTry('git status --porcelain') && gitTry(`git diff --quiet HEAD`)) {
    info('the working tree is clean - nothing to verify yet.');
    info('make your changes, then run `npm run flow` again.');
  } else {
    step(4, total, 'verify');
    await cmdVerify();
  }

  step(5, total, 'commit');
  await cmdCommit();

  step(6, total, 'push');
  cmdPush();

  step(7, total, 'pull request');
  try {
    await cmdPr();
  } catch (e) {
    warn(`could not open the pull request: ${e.message}`);
  }

  step(8, total, 'link the issues');
  try {
    await cmdLink();
  } catch (e) {
    warn(`could not link: ${e.message}`);
  }

  info('');
  info('next: review, let the checks run, then merge.');
  prompt.close();
};

const MENU = [
  { label: 'run the cycle, in order', value: 'cycle' },
  { label: 'new issue', value: 'issue' },
  { label: 'declare the release', value: 'release' },
  { label: 'release status (npm + last runs)', value: 'release-status' },
  { label: 'open the pull request', value: 'pr' },
  { label: 'merge it', value: 'merge' },
  { label: 'clean up the branches', value: 'clean' },
  { label: 'what has accumulated (maintain)', value: 'maintain' },
  { label: 'the label registry', value: 'labels' },
  { label: 'help', value: 'help' },
  { label: 'quit', value: 'quit' },
];

/**
 * The front end: a dashboard, then an arrow-key menu over those same functions.
 *
 * It loops, because a tool that exits after one action is a tool you re-run
 * eight times. With no terminal it refuses rather than guessing: a pipeline, a
 * CI job and an `npm run` whose stdin lost the TTY must not mutate the
 * repository just because nobody was there to answer. Every step it would have
 * driven is a command in its own right, and those take flags and run anywhere.
 */
const cmdWizard = async () => {
  if (!prompt.isInteractive()) {
    bad('no terminal: the cycle asks questions, so it will not run here');
    info('');
    info('the steps, each one usable on its own and in a pipe:');
    info('  flow issue new --template bug|feature|chore|blank --title "..." --summary "..."');
    info('  flow release --bump patch|minor|major|none --summary "..."');
    info('  flow branch <name>');
    info('  flow verify');
    info('  flow commit --subject "..." [--body-file <file>]');
    info('  flow push');
    info('  flow issue sync && flow pr && flow link && flow merge');
    info('');
    info('read-only from anywhere: flow status, flow verify, flow issue list, flow release status');
    process.exitCode = 2;
    return;
  }

  for (;;) {
    info('');
    await cmdStatus();
    const choice = await prompt.menu('What now?', MENU, {
      hint: 'arrows to move, Enter to choose, q to leave',
    });
    if (!choice) {
      info('bye');
      return;
    }
    switch (choice.value) {
      case 'cycle':
        return runCycle();
      case 'issue':
        await cmdIssueNew();
        break;
      case 'release':
        await cmdRelease();
        cmdReleaseSync();
        break;
      case 'release-status':
        await cmdReleaseStatus();
        break;
      case 'pr':
        await cmdPr();
        break;
      case 'merge':
        await cmdMerge();
        break;
      case 'clean':
        await cmdClean();
        break;
      case 'maintain':
        cmdTool('maintain', ['list']);
        break;
      case 'labels':
        cmdTool('labels', ['--list']);
        break;
      case 'help':
        process.stdout.write(USAGE);
        break;
      case 'quit':
      default:
        return;
    }
  }
};

// --- dispatch --------------------------------------------------------------
const USAGE = `flow - the contribution cycle

  flow                        the menu: a dashboard, then the cycle, one step at a time
  flow status                 branch, issue, release, npm and pull request at a glance
  flow verify                 the gate: changeset, generated files, registries, types

  flow issue list             the local registry and its GitHub numbers
  flow issue new              declare an issue locally (template or blank)
  flow issue link <n>         adopt an issue that already exists on GitHub
  flow issue sync             create/update the declared issues on GitHub
  flow issue check            read-only verification (run by CI)
  flow issue archive [id...]  move closed issues into .github/issues/archive

  flow release                declare the bump and the summary
  flow release sync           regenerate .changeset/release.md
  flow release reset          end the cycle (runs in version:bump)
  flow release consolidate    fold every changeset into the single one
  flow release check          drift between the declaration and the changeset (CI)
  flow release status         what npm has, and what the last Release run decided

  flow branch [name]          create and switch to a branch
  flow commit                 commit with the "Issues:" trailer
  flow push                   push and set the upstream
  flow link [pr] [ids...]     write "Closes #n" into the pull request
  flow pr [title]             open the pull request
  flow merge [pr]             merge it, once the checks are green
  flow clean                  delete the branches whose work is on main

  flow maintain [what]        what the cycle leaves behind (also: npm run maintain)
  flow labels [--check]       the label registry and the labeler generated from it
`;

/**
 * The usage, narrowed to the command that was asked about.
 *
 * USAGE stays the single source of truth: `flow issue archive --help` prints the
 * one line that documents it rather than the whole page, and a command with no
 * line of its own falls back to the page.
 */
const usageFor = (group, sub) => {
  if (!group) return USAGE;
  const path = sub ? `${group} ${sub}` : group;
  const lines = USAGE.split('\n').filter((l) => l.trimStart().startsWith(`flow ${path}`));
  return lines.length ? `${lines.join('\n')}\n` : USAGE;
};

const main = async () => {
  const [group, sub] = args;
  // Answered before the switch: no command may run to satisfy a request for its
  // own usage, which is the whole point of a help flag.
  if (wantsHelp()) {
    process.stdout.write(usageFor(group, sub));
    return;
  }
  switch (group) {
    case undefined:
    case 'wizard':
      return cmdWizard();
    case 'status':
      return cmdStatus();
    case 'verify':
      return cmdVerify();
    case 'help':
      // `flow help issue archive` narrows exactly the way `--help` does.
      process.stdout.write(usageFor(args[1], args[2]));
      return;
    case 'issue':
      switch (sub) {
        case undefined:
        case 'list':
          return cmdIssueList();
        case 'new':
          return cmdIssueNew();
        case 'link':
          return cmdIssueLink(Number(args[2]));
        case 'sync':
          return cmdIssueSync();
        case 'check':
          return cmdIssueCheck();
        case 'archive':
          return cmdIssueArchive(args.slice(2));
      }
      break;
    case 'release':
      switch (sub) {
        case undefined:
          return cmdRelease();
        case 'sync':
          return cmdReleaseSync();
        case 'reset':
          return cmdReleaseReset();
        case 'consolidate':
          return cmdReleaseConsolidate();
        case 'check':
          return cmdReleaseCheck();
        case 'status':
          return cmdReleaseStatus();
      }
      break;
    case 'branch':
      return cmdBranch();
    case 'commit':
      return cmdCommit();
    case 'push':
      return cmdPush();
    case 'link':
      return cmdLink();
    case 'pr':
      return cmdPr();
    case 'merge':
      return cmdMerge();
    case 'clean':
      return cmdClean();
    case 'maintain':
    case 'labels':
      return cmdTool(args[0], passthrough(args[0]));
    default:
      break;
  }
  bad(`unknown command: ${args.slice(0, 2).join(' ')}`);
  process.stdout.write(USAGE);
  process.exitCode = 2;
};

// Same reason as maintain: prompt's readline keeps stdin referenced, so any
// command that asked a question would sit here after `main` returns. The wizard
// already closes it; every other prompt in this file relies on this line.
main()
  .catch((e) => {
    bad(e.message);
    process.exitCode = 1;
  })
  .finally(() => prompt.close());
