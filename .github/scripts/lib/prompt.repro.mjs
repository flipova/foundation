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
const firstAsk = prompt.ask('Title', { default: 'should-wait' });
const asked = await Promise.race([
  firstAsk.then((value) => ({ answered: value })),
  new Promise((resolve) => setTimeout(() => resolve({ pending: true }), 400)),
]);

const verdict = asked.pending
  ? 'ASKED - it is waiting for an answer'
  : `ANSWERED WITHOUT ASKING -> "${asked.answered}"`;

// Let it go before asking again: a reader takes one question at a time, and the
// pending one is the whole point of the check above.
if (asked.pending) {
  input.write('my title\n');
  await firstAsk;
}

// A reader takes one question at a time, and the prompts are sequential, so the
// fake terminal is also how the echo is counted: two readers alive at once each
// echo what the other echoed, which is how typing 4 showed 44.
//
// The keystroke is a character that appears nowhere in the prompt or the labels,
// so every occurrence of it in the output is an echo and nothing else.
let written = '';
output.on('data', (chunk) => {
  written += chunk.toString();
});
output.resume();

const KEY = '7';
const countOf = (needle, haystack) => haystack.split(needle).length - 1;
const second = prompt.select('Pick one', [
  { label: 'alpha', value: 'alpha' },
  { label: 'beta', value: 'beta' },
]);
await new Promise((resolve) => setTimeout(resolve, 40));

// The keystroke goes in without Enter on purpose: the echo happens as it is
// typed, and the question stays pending, so nothing else can put that character
// in the output.
const before = written;
input.write(KEY);
await new Promise((resolve) => setTimeout(resolve, 60));
const echoed = countOf(KEY, written.slice(before.length));

input.write('\n');
await new Promise((resolve) => setTimeout(resolve, 40));

const echoOk = echoed === 1;
if (!echoOk) realWrite(`captured      : ${JSON.stringify(written.slice(before.length))}\n`);
realWrite(`\ninteractive     : ${readerBefore}\n`);
realWrite(`menu choice     : ${choice?.value}\n`);
realWrite(`prompt after menu: ${verdict}\n`);
realWrite(`keystroke echoes : ${echoed} (expected 1)\n`);
process.exit(asked.pending && echoOk ? 0 : 1);