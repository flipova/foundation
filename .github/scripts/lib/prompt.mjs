/**
 * Minimal interactive prompts, built on the standard library.
 *
 * The whole point is that a non-interactive run (CI, a pipe, `flow --yes`)
 * never blocks: every question falls back to its documented default and the
 * script keeps going. A wizard that hangs in a pipeline is worse than a wizard
 * that guesses.
 */
import { stdin, stdout } from 'node:process';
import { createInterface } from 'node:readline';

export const isInteractive = () => Boolean(stdin.isTTY && stdout.isTTY);

// One interface, for the menu and for the questions alike.
//
// Two interfaces on the same stdin install two keypress decoders and each of them
// echoes what the other echoed, so a single keystroke came back twice: typing 4
// showed 44, and "my title" came back as "mmyy  ttiittllee". That is why the
// questions do not use `node:readline/promises`: it would be that second reader.
//
// They also cannot use the return value of `readline.Interface.question()`: it
// is the callback form, and since Node 22 it returns `undefined` instead of a
// promise, which every caller read as "answered with nothing" - that is, the
// default. So the callback is wrapped in a promise here, which works on every
// Node version.
let rl = null;

// `readline.createInterface`, not `stdin.createInterface`: Node never defines
// the latter on a stream, so every interactive prompt died with
// "stdin.createInterface is not a function" while the non-interactive path -
// the one CI and pipes take - never touched this line and never noticed.
const iface = () => {
  if (rl?.closed) rl = null;
  return (rl ??= createInterface({ input: stdin, output: stdout }));
};

export function close() {
  rl?.close();
  rl = null;
}

// `question` resolves undefined when the input closes - EOF, Ctrl-D, a pipe
// that ends - and a reader that trims it unguarded crashes precisely when there
// is nobody left to answer. Falling back to the default is what the header of
// this file promises.
const readOnce = async (question) =>
  ((await new Promise((resolve) => {
    iface().question(question, resolve);
  })) ?? '').trim();

const out = (s = '') => stdout.write(`${s}\n`);

export async function ask(question, { default: def = '', hint } = {}) {
  const suffix = def ? ` [${def}]` : '';
  if (!isInteractive()) {
    out(`  ${question}${suffix} -> ${def || '(none)'}`);
    return def;
  }
  // `question` resolves undefined when the input closes - EOF, Ctrl-D, a pipe
  // that ends - and a reader that trims it unguarded crashes precisely when
  // there is nobody left to answer. Falling back to the default is what the
  // header of this file promises.
  return (await readOnce(`${question}${suffix}: `)) || def;
}

/**
 * The menu: arrow keys, one block, repainted in place.
 *
 * `select` above stays exactly as it is and is what a pipe, a CI log or a run
 * without a terminal gets - a prompt that needs a terminal to be readable
 * breaks in precisely the places that matter most. This is the other half: for
 * the human at a real terminal, ↑/↓ move, Enter picks, `q` or Esc walks away,
 * and `1`-`9` still jump straight to a row, so everything the numbered list
 * did still works.
 *
 * Everything is repaint-driven - the block is cleared and rewritten on every
 * key - so the transcript keeps one menu instead of a trail of duplicates. The
 * input and the output are injectable, because a menu with no way to drive it
 * without a real terminal is a menu nothing can test.
 *
 * Returns the chosen entry, or `undefined` when the user walked away.
 */
async function keyMenu({ question, choices, defaultIndex, hint, reader, input, output }) {
  return new Promise((resolve) => {
    let index = Math.min(Math.max(defaultIndex, 0), choices.length - 1);
    let painted = 0; // how many lines of the block are currently on screen
    const width = () => output.columns ?? process.stdout.columns ?? 80;

    const block = () => {
      const room = Math.max(20, width() - 8);
      const cut = (s) => (s.length > room ? `${s.slice(0, room - 3)}...` : s);
      const lines = ['', `  ${question}`];
      if (hint) lines.push(`  \x1b[2m${hint}\x1b[0m`);
      lines.push('');
      choices.forEach((c, i) => {
        const label = cut(c.label ?? String(c));
        lines.push(i === index ? `  \x1b[7m▸ ${label}\x1b[0m` : `    ${label}`);
      });
      lines.push('');
      lines.push('  \x1b[2m↑/↓ move   Enter select   q quit\x1b[0m');
      return lines;
    };

    // Back to the first line of the block, then erase to the end of the screen:
    // one list, always current, whatever the terminal did in between.
    const rewind = (linesUp) => {
      if (linesUp > 0) output.write(`\x1b[${linesUp}A`);
      output.write('\r\x1b[J');
    };

    const paint = () => {
      const lines = block();
      if (painted) rewind(painted - 1);
      output.write(lines.join('\r\n'));
      painted = lines.length;
    };

    // `enter` is not cosmetic: `readline` echoes the Enter that chose a row as a
    // newline, putting the cursor a line *below* the block, while `q` or a digit
    // is echoed on the block's last line. Without that difference the repaint
    // starts one line off and eats the row above the menu.
    const stop = (picked, enter = false) => {
      input.removeListener('keypress', onKey);
      // Anything typed that we did not consume would be read by the next
      // question asked on this same interface.
      try {
        reader.line = '';
        reader.cursor = 0;
      } catch {
        /* the line buffer is an implementation detail, not a contract */
      }
      if (painted) rewind(enter ? painted : painted - 1);
      output.write(`${block().join('\r\n')}\r\n`);
      resolve(picked);
    };

    const move = (delta) => {
      index = (index + delta + choices.length) % choices.length;
      paint();
    };

    function onKey(str, key) {
      const name = key?.name;
      const plain = !key?.ctrl && !key?.meta;
      if (key?.ctrl && name === 'c') {
        process.exitCode = 130;
        stop(undefined);
        return;
      }
      if (name === 'up' || (plain && (str === 'k' || str === 'p'))) return move(-1);
      if (name === 'down' || (plain && (str === 'j' || str === 'n'))) return move(1);
      if (name === 'home') {
        index = 0;
        return paint();
      }
      if (name === 'end') {
        index = choices.length - 1;
        return paint();
      }
      if (name === 'return' || name === 'enter') return stop(choices[index], true);
      if (name === 'escape' || (plain && str === 'q')) return stop(undefined);
      const n = Number(str);
      if (plain && Number.isInteger(n) && n >= 1 && n <= choices.length) {
        index = n - 1;
        return stop(choices[index]);
      }
      // A stray character must not stay painted over the menu, and must not sit
      // in the line buffer the next question will read.
      try {
        reader.line = '';
        reader.cursor = 0;
      } catch {
        /* ditto */
      }
      paint();
    }

    // `readline` treats ↑/↓ as history navigation and repaints the last answer
    // over the block. A menu does not need history; `ask` repopulates it.
    try {
      reader.history = [];
    } catch {
      /* not every reader keeps history */
    }
    // On the *input*, not on the reader: that is where `readline` emits
    // `keypress`, and where it registered its own handler first - so the keys
    // it consumed (Enter, the echo of a typed character) are already applied
    // by the time this runs.
    input.on('keypress', onKey);
    paint();
  });
}

export async function menu(
  question,
  choices,
  { defaultIndex = 0, hint, input = stdin, output = stdout, rl: given, interactive } = {}
) {
  if (!choices.length) return undefined;
  const live = interactive ?? Boolean(input.isTTY && output.isTTY);
  const reader = given ?? iface();
  // A reader that is not in terminal mode never emits `keypress`: without this
  // guard the menu would wait for keys no terminal is going to send.
  if (!live || !reader.terminal) return select(question, choices, { defaultIndex, hint });
  return keyMenu({
    question,
    choices,
    defaultIndex,
    hint,
    reader,
    input,
    output,
  });
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
    const raw = await readOnce(`  [1-${choices.length}] (${defaultIndex + 1}): `);
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
  const raw = await readOnce('  comma-separated, empty for all: ');
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
  const raw = (await readOnce(`${question}${suffix}: `)).toLowerCase();
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
