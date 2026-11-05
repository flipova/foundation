import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { transformWithOxc, type Plugin } from 'vite';

// @rn-primitives packages ship JSX untouched in their .mjs/.js builds (their consumers' bundlers compile it).
const jsxInRnPrimitives: Plugin = {
  name: 'jsx-in-rn-primitives',
  enforce: 'pre',
  transform(code, id) {
    if (!/node_modules\/(@rn-primitives|@gluestack-ui|@react-native-aria|@legendapp|@gorhom)\/.*\.m?jsx?$/.test(id))
      return null;
    return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } } as never);
  },
};

export default defineConfig({
  plugins: [jsxInRnPrimitives],
  define: { __DEV__: true },
  // React Native code is exercised through react-native-web: same components, a DOM to render into.
  // react-native-paper's CommonJS entry would `require('react-native')` behind the alias's back: take its ES build.
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-paper': 'react-native-paper/lib/module/index.js',
      'react-native-svg': path.resolve(__dirname, 'test-support/react-native-svg.tsx'),
      'react-native-reanimated': path.resolve(__dirname, 'test-support/reanimated.tsx'),
      '@legendapp/motion': path.resolve(__dirname, 'test-support/legend-motion.tsx'),
      nativewind: path.resolve(__dirname, 'test-support/nativewind.ts'),
      'react-native-safe-area-context': path.resolve(__dirname, 'test-support/safe-area-context.tsx'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'website/**'],
    passWithNoTests: true,
    server: {
      deps: {
        inline: [
          /nativewind/,
          /react-native-css-interop/,
          /react-native-paper/,
          /@tamagui/,
          /@rn-primitives/,
          /@legendapp/,
          /@gorhom/,
          /@react-native-aria/,
          /react-native-svg/,
          /@gluestack-ui/,
          /react-native-vector-icons/,
        ],
      },
    },
  },
});
