const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const appRoot = __dirname;
const monorepoRoot = path.resolve(__dirname, '../..');

// expo needs appRoot to find app.json/app.config.js
const config = getDefaultConfig(appRoot);

// Watch the whole monorepo so Metro can resolve foundation/ etc.
config.watchFolders = [monorepoRoot];

// Resolve all modules from monorepo root — single node_modules, single React
config.resolver.nodeModulesPaths = [
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  '@foundation': path.resolve(monorepoRoot, 'foundation'),
  stream: path.resolve(monorepoRoot, 'node_modules/readable-stream'),
  buffer: path.resolve(monorepoRoot, 'node_modules/@craftzdog/react-native-buffer'),
};

module.exports = config;
