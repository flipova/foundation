---
"@flipova/foundation": patch
---

Fix: react-native no longer imported in web bundle

Split tsup build into two configs: platform-agnostic entries (index, tokens, theme, layout, config) and a browser-platform web entry. With `platform:"browser"`, esbuild resolves `useColorScheme.web.ts` (window.matchMedia) instead of the React Native version, so `react-native` is never bundled into web consumers.
