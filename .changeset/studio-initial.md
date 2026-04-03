---
"@flipova/foundation": minor
---

Add Flipova Studio — visual app builder integrated into foundation.

- Studio server (Express + WebSocket) with REST API for project, pages, registry, and code generation
- Document tree engine with immutable operations (create, insert, remove, move, update)
- Code generator that produces clean React Native .tsx files importing from @flipova/foundation
- Project generator that scaffolds screens, navigation, theme config, services, and App.tsx
- Web UI with device frame preview, drag & drop from registry, props panel, layers panel, and Expo Snack integration
- CLI: `npx flipova-studio` to start, `npx flipova-studio generate` for headless codegen
- Component registry with 10 base components (Button, TextInput, TextArea, Checkbox, Switch, Badge, Avatar, IconButton, Chip, Spinner)
- Block registry with 7 functional blocks (AuthFormBlock, AvatarBlock, HeaderBlock, SearchBarBlock, StatCardBlock, EmptyStateBlock, ListItemBlock)
- Foundation config system with defineConfig(), FoundationProvider, and token/theme overrides
