/**
 * Reproduces the reported failure on a machine with no real terminal: the menu
 * works, then every prompt after it answers with its default without waiting.
 *
 * The menu closes the readline interface it used; the prompts share that
 * instance through a module-level cache. A closed interface resolves
 * `question()` immediately, so "run the cycle, in order" ran eight steps and
 * asked nothing.
 *
 *   node .github/scripts/lib/prompt.repro.mjs
 *
 * Prints: menu -> prompt, with the verdict. Exit code 0 = the prompt asks,
 * 1 = it is answered without being asked.
 */
import { PassThrough } from 'node:stream';

const input = new PassThrough();
const output = new PassThrough();
output.columns = 80;
output.isTTY = true;
input.isTTY = true;

// The verdict has to reach the real terminal: the module below is about to be
// pointed at fakes.
const realWrite = process.stdout.write.bind(process.stdout);

// The prompts read `stdin`/`stdout` from `node:process` at import time, and they
// are what decide `isInteractive()`. Both have to look like a terminal here.
Object.defineProperty(process, 'stdin', { value: input, configurable: true });
Object.defineProperty(process, 'stdout', { value: output, configurable: true });

const prompt = await import('./prompt.mjs');

// End the menu the way Enter does.
const menuRun = prompt.menu('What now?', [{ label: 'run the cycle, in order', value: 'cycle' }]);
await new Promise((resolve) => setTimeout(resolve, 50));
input.write('\r');
const choice = await menuRun;

// Drain whatever the menu left buffered: this is about the interface being
// closed, not about a stray line answering the next prompt.
input.read();

const readerBefore = prompt.isInteractive();

// A prompt that asks never resolves until it is answered.
const asked = await Promise.race([
  prompt.ask('Title', { default: 'should-wait' }).then((value) => ({ answered: value })),
  new Promise((resolve) => setTimeout(() => resolve({ pending: true }), 400)),
]);

const verdict = asked.pending
  ? 'ASKED - it is waiting for an answer'
  : `ANSWERED WITHOUT ASKING -> "${asked.answered}"`;
realWrite(`\ninteractive     : ${readerBefore}\n`);
realWrite(`menu choice     : ${choice?.value}\n`);
realWrite(`prompt after menu: ${verdict}\n`);
process.exit(asked.pending ? 0 : 1);