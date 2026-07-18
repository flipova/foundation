/**
 * react-native-web polyfill shim for Docusaurus docs build.
 *
 * Extends react-native-web with stubs for the React Native APIs that
 * react-native-maps (and similar native packages) call at import time:
 * - requireNativeComponent
 * - codegenNativeComponent
 * - codegenNativeCommands
 * - TurboModuleRegistry
 *
 * This shim is aliased as `react-native$` in docusaurus.config.ts so that
 * every `import from 'react-native'` in the docs bundle goes through here.
 */

// Re-export everything from the real react-native-web
const rnw = require('react-native-web');
const exported = { ...rnw };

// Polyfill native-only APIs that react-native-maps calls at module evaluation time.
// These are no-ops on the web - they just need to exist to prevent import errors.
exported.requireNativeComponent = () => 'View';
exported.codegenNativeComponent = () => 'View';
exported.codegenNativeCommands = () => ({});
exported.TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => ({}),
};

module.exports = exported;
module.exports.default = exported;
module.exports.__esModule = true;
