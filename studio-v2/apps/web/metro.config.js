const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const appRoot      = __dirname;
const monorepoRoot = path.resolve(__dirname, '../../..'); // foundation/
const nm           = path.join(monorepoRoot, 'node_modules');

const config = getDefaultConfig(appRoot);

// ── Watch only the source folders needed, not all of node_modules ─────────────
// Watching the full monorepoRoot includes node_modules which makes Metro
// extremely slow. Instead, list only the specific source directories.
config.watchFolders = [
  path.join(monorepoRoot, 'foundation'),
  path.join(monorepoRoot, 'studio-v2', 'packages'),
];

// ── Single node_modules at monorepo root ─────────────────────────────────────
config.resolver.nodeModulesPaths = [nm];

// ── Package aliases ───────────────────────────────────────────────────────────
// Map workspace package names so Metro resolves them from source.
// Explicit aliasing of singletons (zustand, immer, react) prevents duplicate
// instances when imports originate from packages outside appRoot.
config.resolver.extraNodeModules = {
  // Workspace packages (resolved from source)
  '@flipova/foundation':    monorepoRoot,
  '@flipova/studio-core':   path.join(monorepoRoot, 'studio-v2/packages/core'),
  '@flipova/studio-engine': path.join(monorepoRoot, 'studio-v2/packages/engine'),

  // Singleton packages — always resolve from root node_modules
  'zustand':   path.join(nm, 'zustand'),
  'immer':     path.join(nm, 'immer'),
  'react':     path.join(nm, 'react'),
  'react-dom': path.join(nm, 'react-dom'),

  // Node polyfills for React Native web
  'stream': path.join(nm, 'readable-stream'),
  'buffer': path.join(nm, '@craftzdog/react-native-buffer'),
};

module.exports = config;
