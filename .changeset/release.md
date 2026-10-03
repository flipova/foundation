---
'@flipova/foundation': patch
---

the provider publishes its theme colours in a context and useGluestackColors reads the mounted theme first, so an app that adopted the registries reads its own branding and not the package palette
