/**
 * Native stub module for Docusaurus / web builds.
 *
 * Some Foundation components are wrapped in platform-specific files (.web.tsx / .tsx).
 * However, some native-only dependencies (react-native-maps, lottie-react-native, etc.)
 * may still get pulled into the Webpack bundle when Docusaurus processes shared code.
 *
 * This stub replaces those packages with a safe no-op so the build succeeds.
 * The affected components render nothing on the web — use `.web.tsx` implementations for real previews.
 */

const noop = () => null;
noop.displayName = 'NativeStub';

// Proxy that returns noop for any property access
const stubProxy = new Proxy(noop, {
  get: (_, prop) => {
    if (prop === '__esModule') return true;
    if (prop === 'default') return noop;
    return noop;
  },
  apply: () => null,
});

module.exports = stubProxy;
module.exports.default = noop;
