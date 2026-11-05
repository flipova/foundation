import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { UI_NAMES, type UiName } from './contract';
import type { ProviderAdapter } from './providers';
import { flipova, flipovaComponents } from './providers/flipova';
import { gluestack } from './providers/gluestack';
import { paper } from './providers/paper';
import { reusables } from './providers/reusables';
import { tamagui } from './providers/tamagui';
import { rnBase } from './providers/rn-base';
import * as ui from './ui';
import { coverageOf } from './ui';

/**
 * Alignment of the components across providers. gluestack's catalogue (components/providers/gluestack/ui) is the
 * reference list: every component in it is part of the contract, flipova implements all of them, the unified `ui`
 * exports all of them, and each other provider either implements one natively or falls back to flipova. Adding a
 * component to the catalogue, or a native one to an adapter, makes this file say what else has to change.
 */

/** gluestack catalogue directory -> contract name. A new directory fails the test until it is mapped here. */
const CATALOGUE_MAP: Record<string, UiName> = {
  accordion: 'Accordion',
  actionsheet: 'ActionSheet',
  alert: 'Alert',
  'alert-dialog': 'AlertDialog',
  avatar: 'Avatar',
  badge: 'Badge',
  bottomsheet: 'BottomSheet',
  box: 'Box',
  button: 'Button',
  calendar: 'Calendar',
  card: 'Card',
  center: 'Center',
  checkbox: 'Checkbox',
  'date-time-picker': 'DateTimePicker',
  divider: 'Divider',
  drawer: 'Drawer',
  fab: 'Fab',
  'flat-list': 'FlatList',
  'form-control': 'FormControl',
  grid: 'Grid',
  heading: 'Heading',
  hstack: 'HStack',
  icon: 'Icon',
  image: 'Image',
  'image-background': 'ImageBackground',
  'image-viewer': 'ImageViewer',
  input: 'Input',
  'input-accessory-view': 'InputAccessoryView',
  'keyboard-avoiding-view': 'KeyboardAvoidingView',
  link: 'Link',
  'liquid-glass': 'LiquidGlass',
  menu: 'Menu',
  modal: 'Modal',
  popover: 'Popover',
  portal: 'Portal',
  pressable: 'Pressable',
  progress: 'Progress',
  radio: 'RadioGroup',
  'refresh-control': 'RefreshControl',
  'safe-area-view': 'SafeAreaView',
  'scroll-view': 'ScrollView',
  'section-list': 'SectionList',
  select: 'Select',
  skeleton: 'Skeleton',
  slider: 'Slider',
  spinner: 'Spinner',
  'status-bar': 'StatusBar',
  switch: 'Switch',
  table: 'Table',
  tabs: 'Tabs',
  text: 'Text',
  textarea: 'Textarea',
  toast: 'Toast',
  tooltip: 'Tooltip',
  view: 'View',
  'virtualized-list': 'VirtualizedList',
  vstack: 'VStack',
};
/** directories of the catalogue that are infrastructure, not a component */
const NOT_COMPONENTS = ['gluestack-ui-provider'];

/**
 * gluestack modules the test environment cannot load even with the animation libraries stubbed (test-support/):
 * a wrapper for them could not be verified, so none is declared.
 */
const GLUESTACK_UNVERIFIABLE: Partial<Record<UiName, string>> = {
  BottomSheet: 'depends on @gorhom/bottom-sheet, which cannot be loaded by the test environment',
  DateTimePicker:
    'depends on @react-native-community/datetimepicker (Flow source), which cannot be loaded by the test environment',
  ImageViewer: 'depends on react-native-gesture-handler, which cannot be loaded by the test environment',
  Slider: 'its dependency @react-aria/label is not installed',
};

const ROOT = resolve(__dirname);
const adapters: ProviderAdapter[] = [flipova, gluestack, reusables, paper, tamagui];
const catalogue = readdirSync(join(ROOT, 'providers/gluestack/ui'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !NOT_COMPONENTS.includes(d.name))
  .map((d) => d.name)
  .sort();

describe('alignment: the contract covers gluestack’s catalogue', () => {
  it('every catalogue directory is mapped to a contract name, and no mapping is stale', () => {
    const unmapped = catalogue.filter((d) => !(d in CATALOGUE_MAP));
    expect(unmapped, `add to CATALOGUE_MAP and to the contract: ${unmapped.join(', ')}`).toEqual([]);
    expect(Object.keys(CATALOGUE_MAP).filter((d) => !catalogue.includes(d))).toEqual([]);
  });

  it('the mapping is one to one with UI_NAMES', () => {
    const names = Object.values(CATALOGUE_MAP);
    expect(new Set(names).size).toBe(names.length);
    expect([...names].sort()).toEqual([...UI_NAMES].sort());
  });
});

describe('alignment: flipova and the unified ui have every component', () => {
  it('flipova implements every name, each in its own file', () => {
    expect(Object.keys(flipovaComponents).sort()).toEqual([...UI_NAMES].sort());
    for (const n of UI_NAMES) expect(existsSync(join(ROOT, 'providers/flipova/components', `${n}.tsx`)), n).toBe(true);
  });

  it('the unified ui exports every name', () => {
    const missing = UI_NAMES.filter((n) => typeof (ui as Record<string, unknown>)[n] !== 'function');
    expect(missing).toEqual([]);
  });
});

describe('alignment: adapters only declare real components', () => {
  it.each(adapters.map((a) => [a.name, a] as const))('%s declares only names of the contract', (_n, a) => {
    expect(Object.keys(a.components).filter((n) => !(UI_NAMES as readonly string[]).includes(n))).toEqual([]);
    for (const [n, c] of Object.entries(a.components)) expect(typeof c, n).toBe('function');
  });

  it('gluestack declares no component whose module the tests cannot load', () => {
    const bad = Object.keys(gluestack.components).filter((n) => n in GLUESTACK_UNVERIFIABLE);
    expect(bad).toEqual([]);
  });

  it('every component is native somewhere or falls back to flipova: the totals add up', () => {
    for (const a of adapters) {
      const c = coverageOf(a);
      expect(c.native.length + c.fallback.length, a.name).toBe(UI_NAMES.length);
    }
  });
});

// ---- the coverage table -----------------------------------------------------------------------------------------------

function table(): string {
  const cov = Object.fromEntries(adapters.map((a) => [a.name, coverageOf(a)])) as Record<
    string,
    ReturnType<typeof coverageOf>
  >;
  const names = [...UI_NAMES];
  const byName = Object.fromEntries(adapters.map((a) => [a.name, a]));
  // 'RN' = React Native's own component, shared by every adapter (providers/rn-base); 'native' = the library's own
  const mark = (p: string, n: UiName) =>
    !cov[p]!.native.includes(n) ? 'flipova' : byName[p]!.components[n] === rnBase[n] ? 'RN' : 'native';
  const lib = (p: string) => names.filter((n) => mark(p, n) === 'native').length;
  const base = (p: string) => names.filter((n) => mark(p, n) === 'RN').length;
  const reason = (n: UiName) => GLUESTACK_UNVERIFIABLE[n];
  const lines: string[] = [
    '# Components by provider',
    '',
    '<!-- generated by components/alignment.test.ts (UPDATE_COMPONENTS_DOC=1 npm run components:doc): do not edit by hand -->',
    '',
    `The contract has **${names.length}** components: the whole gluestack catalogue. flipova implements all of them in plain React Native. For every other provider a component is either **native** (the library’s own component, with the design applied) or **flipova** (the flipova one is rendered instead, so \`@flipova/foundation/ui\` always has the whole set). **RN** marks components that are React Native itself (View, ScrollView, FlatList, Image…): no library replaces them, so the adapters that do not wrap their own serve the same ones (\`providers/rn-base\`).`,
    '',
    '| Provider | Native in total | of which the library’s own | of which React Native’s (shared) | Falls back to flipova |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...adapters.map(
      (a) =>
        `| ${a.name} | ${cov[a.name]!.native.length} | ${lib(a.name)} | ${base(a.name)} | ${cov[a.name]!.fallback.length} |`,
    ),
    '',
    '| Component | flipova | gluestack | paper | tamagui | reusables |',
    '| --- | :---: | :---: | :---: | :---: | :---: |',
    ...names.map(
      (n) =>
        `| ${n} | ${mark('flipova', n)} | ${mark('gluestack', n)} | ${mark('paper', n)} | ${mark('tamagui', n)} | ${mark('reusables', n)} |`,
    ),
    '',
    '## gluestack components that fall back, and why',
    '',
    ...names
      .filter((n) => mark('gluestack', n) === 'flipova')
      .map((n) => `- **${n}**: ${reason(n) ?? 'the module loads, but no verified wrapper is written yet'}`),
    '',
  ];
  return lines.join('\n');
}

describe('alignment: COMPONENTS.md', () => {
  const file = resolve(ROOT, '..', 'COMPONENTS.md');
  it('is up to date', () => {
    if (process.env.UPDATE_COMPONENTS_DOC) writeFileSync(file, table());
    expect(existsSync(file), 'run: npm run components:doc').toBe(true);
    expect(readFileSync(file, 'utf8')).toBe(table());
  });
});
