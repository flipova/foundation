#!/usr/bin/env node
/**
 * `flow` - the whole contribution cycle, in one tool, in order.
 *
 *   flow                      run the cycle interactively, step by step
 *   flow status               where am I: branch, issue, release, PR
 *
 *   flow issue list           the local registry and its GitHub numbers
 *   flow issue new            declare an issue locally, from a template or blank
 *   flow issue link <n>       adopt an issue that already exists on GitHub
 *   flow issue sync           create/update the declared issues on GitHub
 *   flow release              declare the bump and the summary (the one changeset)
 *   flow release sync         regenerate .changeset/release.md from the declaration
 *   flow release consolidate  fold every existing changeset into the single one
 *   flow release check        drift between the declaration and the changeset (CI)
 *   flow branch [name]        create and switch to a branch
 *   flow commit               commit with the `Issues:` trailer
 *   flow push                 push and set the upstream
 *   flow link [pr]            write `Closes #n` into the pull request
 *   flow pr                   open the pull request
 *
 * Every step is also usable on its own, and the wizard never repeats a step
 * that is already done.
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
import { readNumbers, readRegistry, reconcile, slugify, uniqueSlug, writeIssue, writeNumbers } from './lib/registry.mjs';
import {
  ALL_KINDS,
  CHANGESET,
  DECLARATION,
  checkDrift,
  consolidate,
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
    : await select('Version bump?', ALL_KINDS.map((k) => ({ label: k, value: k })), {
        defaultIndex: Math.max(0, ALL_KINDS.indexOf(current.bump)),
        hint: '  none = nothing to release this cycle',
      });

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
    const r = spawnSync(argv[0], argv.slice(1), { cwd: ROOT, shell: true, encoding: 'utf8' });
    if (r.status === 0) {
      good(what);
      continue;
    }
    bad(`failed: ${what}`);
    const noise = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
    if (noise) info(noise.split('\n').slice(-12).map((l) => `    ${l}`).join('\n'));
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

// --- git -------------------------------------------------------------------
const cmdBranch = async () => {
  const given = args[1] ?? opt('name') ?? (opt('topic') ? slugify(opt('topic')) : undefined);
  const name = given ?? (await ask('Branch name', { default: slugify(await ask('What is it about?', { default: currentBranch() })) }));
  if (gitTry(`git rev-parse --verify ${name}`)) {
    bad(`branch ${name} already exists - switch to it, or pick another name`);
    process.exitCode = 2;
    return;
  }
  git(`git switch -c ${name}`);
  const state = readState();
  writeState({ ...state, branch: name, issues: [] });
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
  const fileBody =
    bodyFileIn && existsSync(bodyFileIn) ? readFileSync(bodyFileIn, 'utf8').replace(/\s+$/, '') : '';

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
      body = lines.slice(at + 1).join('\n').replace(/^\s*\n/, '').replace(/\s+$/, '');
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
    if (issue.id === 'collaboration-automation') flags.push('in progress');
    info(
      `  ${String(numbers[issue.id] ?? 'unlinked').padEnd(9)} ${issue.id.padEnd(26)} ${issue.title.slice(0, 52)}${
        flags.length ? `  \x1b[2m[${flags.join(', ')}]\x1b[0m` : ''
      }`,
    );
  }
};

const cmdIssueNew = async () => {
  const registry = readRegistry();
  const taken = new Set(registry.map((i) => i.id));
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
    : await select('Which template?', names.map((n) => ({ label: n, value: n })), {
        hint: '  (blank = no template, just a title)',
      });
  const template = picked ? defs[picked.value] : { title: '', labels: [], body: '{{summary}}' };

  const title = opt('title') ?? (await ask('Title', { default: template.title }));
  if (!title) {
    bad('an issue needs a title');
    process.exitCode = 2;
    return null;
  }
  const summary =
    opt('summary') ??
    (await ask('One-line summary (the rest of the body is yours to edit)', {
      hint: '  written to .github/issues/<id>.yml - edit it afterwards for the detail',
    }));
  const labels = opt('labels') ? opt('labels').split(',').map((l) => l.trim()).filter(Boolean) : template.labels ?? [];

  const bare = title.replace(/^\[[^\]]+\]:\s*/, '');
  const id = uniqueSlug(slugify(bare), taken);
  const file = writeIssue(
    { id, title, labels, body: String(template.body).replace('{{summary}}', summary || bare) },
    'Declared locally. `flow issue sync` creates it on GitHub and records the number.',
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
  await requireToken('flow issue link');
  const remote = await getIssue(number);
  if (isPullRequest(remote)) {
    bad(`#${number} is a pull request. GitHub shares one numbering, so only an issue can be closed.`);
    process.exitCode = 2;
    return null;
  }
  const registry = readRegistry();
  const numbers = readNumbers();
  const existing = registry.find((i) => numbers[i.id] === number);
  if (existing) {
    info(`#${number} is already declared locally as "${existing.id}".`);
    return existing.id;
  }
  const id = uniqueSlug(slugify(remote.title.replace(/^\[[^\]]+\]:\s*/, '')), new Set(registry.map((i) => i.id)));
  writeIssue(
    {
      id,
      title: remote.title,
      labels: remote.labels.map((l) => l.name).filter((l) => !l.startsWith('size/')),
      body: remote.body ?? '',
    },
    `Adopted from GitHub issue #${number} on ${remote.created_at?.slice(0, 10) ?? 'the tracker'}. Edit the body here; \`flow issue sync\` never overwrites a GitHub body, only the title and the labels.`,
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
  const { problems } = await reconcile(registry, { apply: false });
  if (problems.length) {
    bad(`issues: ${problems.length} problem(s):`);
    for (const p of problems) bad(`  - ${p}`);
    process.exitCode = 1;
    return;
  }
  good(`issues: ${registry.length} declared issue(s) consistent with GitHub.`);
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
  info(`#${pr.number}: ${runs.check_runs.length} check(s) - ${passing} ok, ${failing.length} failing, ${pending.length} pending`);

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

  const locals = git('git for-each-ref --format=%(refname:short) refs/heads')
    .split('\n')
    .map((b) => b.trim())
    .filter((b) => b && !keep.has(b) && b !== here);
  const done = locals.filter((b) => gitTry(`git merge-base --is-ancestor ${b} main`) !== null);
  for (const b of done) {
    git(`git branch -D ${b}`);
    good(`deleted local ${b}`);
  }
  info(`local: ${done.length} merged of ${locals.length} candidate(s)`);

  await requireToken('flow clean');
  const closed = await api('/pulls?state=closed&per_page=100');
  const mergedRefs = new Set(closed.filter((p) => p.merged_at).map((p) => p.head.ref));

  const remotes = git('git for-each-ref --format=%(refname:short) refs/remotes/origin')
    .split('\n')
    .map((b) => b.trim().replace(/^origin\//, ''))
    .filter((b) => b && !keep.has(b) && b !== 'HEAD' && b !== here);
  const prunable = remotes.filter(
    (b) => mergedRefs.has(b) || gitTry(`git merge-base --is-ancestor origin/${b} main`) !== null,
  );
  for (const b of prunable) {
    const gone = await api(`/git/refs/heads/${b}`, { method: 'DELETE' })
      .then(() => true)
      .catch(() => false);
    if (gone) good(`deleted origin/${b}`);
  }
  info(`remote: ${prunable.length} of ${remotes.length} candidate(s)`);
  gitTry('git fetch --prune origin');
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
  info(`issue        ${state.issues.length ? state.issues.map((id) => `${id}${numbers[id] ? ` (#${numbers[id]})` : ' (unlinked)'}`).join(', ') : '(none declared for this branch)'}`);
  info(`release      bump: ${declaration.bump}${existsSync(CHANGESET) ? '' : '   [changeset missing - flow release sync]'}`);
  info(`working tree ${dirty ? 'uncommitted changes' : 'clean'}`);
  let pr = null;
  try {
    pr = await findPullRequest(branch);
  } catch {
    info('pull request (could not be reached)');
  }
  if (pr) info(`pull request #${pr.number}  ${pr.title}`);
};

// --- the wizard ------------------------------------------------------------
/**
 * The cycle, in order, skipping whatever is already done. The order is the
 * point: an issue exists before the branch that implements it, the release is
 * declared before the commit, and the pull request exists before it is linked.
 */
const cmdWizard = async () => {
  const total = 8;
  const branch = currentBranch();
  const state = readState();

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

// --- dispatch --------------------------------------------------------------
const USAGE = `flow - the contribution cycle

  flow                        the cycle, interactively, in order
  flow status                 branch, issue, release and pull request at a glance
  flow verify                 the gate: changeset, generated files, registries, types

  flow issue list             the local registry and its GitHub numbers
  flow issue new              declare an issue locally (template or blank)
  flow issue link <n>         adopt an issue that already exists on GitHub
  flow issue sync             create/update the declared issues on GitHub
  flow issue check            read-only verification (run by CI)

  flow release                declare the bump and the summary
  flow release sync           regenerate .changeset/release.md
  flow release reset          end the cycle (runs in version:bump)
  flow release consolidate    fold every changeset into the single one
  flow release check          drift between the declaration and the changeset (CI)

  flow branch [name]          create and switch to a branch
  flow commit                 commit with the "Issues:" trailer
  flow push                   push and set the upstream
  flow link [pr] [ids...]     write "Closes #n" into the pull request
  flow pr [title]             open the pull request
  flow merge [pr]             merge it, once the checks are green
  flow clean                  delete the branches whose work is on main
`;

const main = async () => {
  const [group, sub] = args;
  switch (group) {
    case undefined:
    case 'wizard':
      return cmdWizard();
    case 'status':
      return cmdStatus();
    case 'verify':
      return cmdVerify();
    case 'help':
    case '--help':
      process.stdout.write(USAGE);
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

