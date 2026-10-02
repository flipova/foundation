/**
 * Minimal interactive prompts, built on the standard library.
 *
 * The whole point is that a non-interactive run (CI, a pipe, `flow --yes`)
 * never blocks: every question falls back to its documented default and the
 * script keeps going. A wizard that hangs in a pipeline is worse than a wizard
 * that guesses.
 */
import { stdin, stdout } from 'node:process';

export const isInteractive = () => Boolean(stdin.isTTY && stdout.isTTY);

let rl = null;
const iface = () => (rl ??= stdin.createInterface({ input: stdin, output: stdout }));

export function close() {
  rl?.close();
  rl = null;
}

const out = (s = '') => stdout.write(`${s}\n`);

export async function ask(question, { default: def = '', hint } = {}) {
  const suffix = def ? ` [${def}]` : '';
  if (!isInteractive()) {
    out(`  ${question}${suffix} -> ${def || '(none)'}`);
    return def;
  }
  const answer = (await iface().question(`${question}${suffix}: `)).trim();
  return answer || def;
}

export async function select(question, choices, { defaultIndex = 0, hint } = {}) {
  if (!choices.length) return undefined;
  out(`\n${question}`);
  choices.forEach((c, i) => out(`  ${i + 1}) ${c.label ?? c}`));
  if (hint) out(`  ${hint}`);
  if (!isInteractive()) {
    out(`  -> ${choices[defaultIndex]?.label ?? choices[defaultIndex]}`);
    return choices[defaultIndex];
  }
  for (;;) {
    const raw = (await iface().question(`  [1-${choices.length}] (${defaultIndex + 1}): `)).trim();
    if (!raw) return choices[defaultIndex];
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 1 && n <= choices.length) return choices[n - 1];
    out(`  not a choice: ${raw}`);
  }
}

export async function multiSelect(question, choices, { hint } = {}) {
  if (!choices.length) return [];
  out(`\n${question}`);
  choices.forEach((c, i) => out(`  ${i + 1}) ${c.label ?? c}`));
  if (hint) out(`  ${hint}`);
  if (!isInteractive()) return choices;
  const raw = (await iface().question('  comma-separated, empty for all: ')).trim();
  if (!raw) return choices;
  const wanted = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return choices.filter((c, i) => wanted.includes(String(i + 1)) || wanted.includes(c.value ?? c.label ?? c));
}

export async function confirm(question, { default: def = true } = {}) {
  const suffix = def ? ' [Y/n]' : ' [y/N]';
  if (!isInteractive()) {
    out(`  ${question}${suffix} -> ${def}`);
    return def;
  }
  const raw = (await iface().question(`${question}${suffix}: `)).trim().toLowerCase();
  if (!raw) return def;
  return raw === 'y' || raw === 'yes';
}

/** Print a titled block, so a wizard transcript stays readable. */
export function step(n, total, title) {
  out(`\n\x1b[1m[${n}/${total}] ${title}\x1b[0m`);
}

export const info = (s) => out(`  ${s}`);
export const warn = (s) => out(`\x1b[33m  ! ${s}\x1b[0m`);
export const bad = (s) => out(`\x1b[31m  x ${s}\x1b[0m`);
export const good = (s) => out(`\x1b[32m  + ${s}\x1b[0m`);
