---
'@flipova/foundation': minor
---

flipova-design adopt: an app copies the design registries into design/ (and only the registries), the manifest outputs are rewritten to theme/config.ts and theme/tokens.js, and theme/provider.tsx is created
createGluestackUIProvider(theme) is exported from @flipova/foundation/ui, so an app mounts a provider built from its own generated theme; GluestackUIProvider remains the package theme
design.js resolves the Python sources from the package instead of the registry directory, so an adopted copy without tools/ has a working generator
