---
"@flipova/foundation": minor
---

**feat(sso): add `@flipova/foundation/sso` SDK**

New sub-package providing a lightweight, framework-agnostic OAuth2 PKCE SSO SDK for React web applications.

- `SSOProvider` — React context provider (handles login callback, token persistence, auto-refresh)
- `useSSOAuth()` — Hook exposing `user`, `tokens`, `login`, `logout`, `refreshToken`, `isLoading`, `isAuthenticated`
- `withSSO(Component)` — HOC to protect pages/routes
- `createSSOClient(config)` — Low-level client for custom flows
- Built-in support for **Flipova Accounts** and **Google OAuth** with PKCE
- Fully extensible with `provider: "custom"` + arbitrary endpoints

**fix(build): eliminate native dependency leaks from web bundles**

Extracted all native/Expo package references into a dedicated `nativeExternal` list and ensured they are marked `external` in ALL tsup build targets (including `layout/index`). The problematic `chunk-32VWREEH.mjs` (which imported `@expo/vector-icons`, `react-native-gesture-handler`, `react-native-reanimated`, `expo-camera`) no longer leaks into consumer web bundles.

Web projects importing `@flipova/foundation/layout` no longer need to provide shims for native packages.

**fix(cli): remove broken `flipova-studio` bin entry**

The `bin` field pointed to `./dist/studio-v2/cli/index.js` which did not exist (studio-v2 CLI not yet implemented). The entry has been removed to prevent `npx flipova-studio` from crashing with `MODULE_NOT_FOUND`.

**chore(studio-v1): remove studio v1 directory**

Studio v1 (`studio/`) has been superseded by studio-v2 and is no longer maintained or referenced. Removed from the repository.

**chore(build): clean up tsup.config.ts and package.json scripts**

- Removed studio-v1 and studio-v2 build/dev scripts that no longer apply
- Removed broken `studio-v2/cli/index` tsup entry
- Added `sso/index` build entry (browser platform, pure ESM+CJS)
