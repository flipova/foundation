'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { check, importsOf } = require('./check-boundary');

/** builds a throwaway package tree: { 'components/ui/x.ts': 'source', ... } */
function tree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'boundary-'));
  for (const [rel, src] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), src);
  }
  return root;
}
const rules = (files) => check(tree(files)).map((v) => `${v.rule}:${v.file}`);

const CLEAN = {
  'index.ts': "export * from './components/ui';\n",
  'components/theme/design-theme.ts': 'export const designTheme = {};\n',
  'components/contract/index.ts':
    "import { designTheme } from '../theme/design-theme';\nexport const x = designTheme;\n",
  'components/providers/types.ts': "import type { X } from '../contract';\n",
  'components/providers/provider.tsx': "import { y } from '../contract';\nimport type { A } from './types';\n",
  'components/providers/css-vars.ts': "import { vars } from 'nativewind';\n",
  'components/providers/flipova/index.tsx':
    "import { View } from 'react-native';\nimport React from 'react';\nimport { x } from '../../contract';\nimport { d } from '../types';\n",
  'components/providers/flipova/components/Button.tsx': "import { useResolvedTheme } from '../../provider';\n",
  'components/providers/paper/index.tsx':
    "import { Button } from 'react-native-paper';\nimport { x } from '../../contract';\nimport { d } from '../types';\n",
  'components/providers/reusables/index.tsx':
    "import { Switch } from '@rn-primitives/switch';\nimport { cssVarTables } from '../css-vars';\n",
  'components/providers/gluestack/index.tsx':
    "import { Button } from './ui/button';\nimport { cssVarTables } from '../css-vars';\n",
  'components/providers/gluestack/ui/button/index.tsx': "import { x } from '../gluestack-ui-provider';\n",
  'components/providers/tamagui/index.tsx': "import { createTamagui } from '@tamagui/core';\n",
  'components/ui/index.ts':
    "import { flipovaComponents } from '../providers/flipova';\nimport { useAdapter } from '../providers/provider';\n",
};

test('a tree that respects the layers is clean', () => assert.deepEqual(rules(CLEAN), []));

test('the real repository is clean', () => assert.deepEqual(check(path.resolve(__dirname, '..')), []));

test('importing another @flipova package is refused', () => {
  assert.deepEqual(rules({ ...CLEAN, 'components/ui/x.ts': "import { Layout } from '@flipova/frontend';\n" }), [
    'no-upward:components/ui/x.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/ui/x.ts': "const a = require('@flipova/accounts/auth');\n" }), [
    'no-upward:components/ui/x.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/ui/x.ts': "const a = await import('@flipova/app');\n" }), [
    'no-upward:components/ui/x.ts',
  ]);
});

test('frontend material under components/ is refused', () => {
  for (const d of ['layouts', 'sections', 'auth', 'mockups', 'effects', 'Screens'])
    assert.deepEqual(rules({ ...CLEAN, [`components/${d}/a.tsx`]: 'export {};\n' }), [
      `frontend-material:components/${d}`,
    ]);
});

test('layers: nothing imports a layer above it', () => {
  assert.deepEqual(rules({ ...CLEAN, 'components/theme/a.ts': "import '../contract';\n" }), [
    'layers:components/theme/a.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/contract/a.ts': "import '../providers';\n" }), [
    'layers:components/contract/a.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/provider.tsx': "import '../ui';\n" }), [
    'layers:components/providers/provider.tsx',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/types.ts': "import './paper';\n" }), [
    'layers:components/providers/types.ts',
  ]);
});

test('layers: a provider does not import another provider, nor ui unless it is gluestack (apart from the generated variables)', () => {
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/paper/a.ts': "import '../tamagui';\n" }), [
    'layers:components/providers/paper/a.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/paper/a.ts': "import '../../ui/button';\n" }), [
    'layers:components/providers/paper/a.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/reusables/a.ts': "import '../../ui/button';\n" }), [
    'layers:components/providers/reusables/a.ts',
  ]);
});

test('an optional peer is imported only by its own provider', () => {
  assert.deepEqual(rules({ ...CLEAN, 'components/ui/a.ts': "import 'react-native-paper';\n" }), [
    'optional-peer:components/ui/a.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'index.ts': "export * from '@tamagui/core';\n" }), ['optional-peer:index.ts']);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/provider.tsx': "import '@rn-primitives/switch';\n" }), [
    'optional-peer:components/providers/provider.tsx',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/paper/a.ts': "import '@tamagui/core';\n" }), [
    'optional-peer:components/providers/paper/a.ts',
  ]);
});

test('comments are not imports; imports are found on the right line', () => {
  const src =
    "/* import x from '@flipova/frontend' */\n// import y from 'react-native-paper'\nimport z from '@flipova/app';\n";
  assert.deepEqual(
    importsOf(src).map((i) => [i.spec, i.line]),
    [['@flipova/app', 3]],
  );
  assert.deepEqual(
    rules({
      ...CLEAN,
      'components/ui/a.ts': "/**\n * const t = require('@flipova/foundation/tokens');\n */\nexport {};\n",
    }),
    [],
  );
});

test('leaving the package with a relative import is refused', () => {
  assert.deepEqual(rules({ ...CLEAN, 'components/ui/a.ts': "import '../../../frontend/x';\n" }), [
    'outside-package:components/ui/a.ts',
  ]);
});

test('the flipova provider is built from react and react-native only', () => {
  assert.deepEqual(
    rules({ ...CLEAN, 'components/providers/flipova/components/X.tsx': "import { Box } from '@gluestack-ui/core';\n" }),
    ['flipova-pure:components/providers/flipova/components/X.tsx'],
  );
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/flipova/components/X.tsx': "import 'nativewind';\n" }), [
    'flipova-pure:components/providers/flipova/components/X.tsx',
  ]);
  assert.deepEqual(
    rules({ ...CLEAN, 'components/providers/flipova/components/X.tsx': "import 'react-native-svg';\n" }),
    ['flipova-pure:components/providers/flipova/components/X.tsx'],
  );
});

test('the unified ui reaches only the flipova provider; providers never import ui', () => {
  assert.deepEqual(rules({ ...CLEAN, 'components/ui/x.ts': "import '../providers/paper';\n" }), [
    'layers:components/ui/x.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/paper/x.ts': "import '../../ui';\n" }), [
    'layers:components/providers/paper/x.ts',
  ]);
  assert.deepEqual(rules({ ...CLEAN, 'components/providers/flipova/x.ts': "import '../../ui';\n" }), [
    'layers:components/providers/flipova/x.ts',
  ]);
});

test('the gluestack catalogue is a provider-internal folder, not the unified ui', () => {
  assert.deepEqual(
    rules({ ...CLEAN, 'components/providers/gluestack/ui/button/b.tsx': "import '../../../paper';\n" }),
    ['layers:components/providers/gluestack/ui/button/b.tsx'],
  );
});
