# Implementation Plan: Studio Navigation & Screen Management

## Overview

Incremental implementation of five additive features: screen renaming, screen grouping, tab navigation enhancements, drawer navigation enhancements, and real-time bidirectional Snack sync.

## Tasks

- [x] 1. Add `renamePage` operation and type additions
  - [x] 1.1 Add `DrawerConfig` interface and `drawerConfig` field to `ProjectDocument` in `studio/engine/tree/types.ts`
    - Define `DrawerConfig` with `backgroundColor`, `activeTintColor`, `inactiveTintColor`, `drawerPosition` fields
    - Add optional `drawerConfig?: DrawerConfig` to `ProjectDocument`
    - _Requirements: 4.5_

  - [x] 1.2 Implement `renamePage` pure function in `studio/engine/tree/operations.ts`
    - Accept `(project, pageId, newName)`, return `{ project, oldRoute }`
    - Update `PageDocument.name`, `PageDocument.route`, and matching `NavigationScreen.name`
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 1.3 Write property test for `renamePage` atomicity (Property 4)
    - **Property 4: Rename updates all three fields atomically**
    - **Validates: Requirements 1.1**

  - [ ]* 1.4 Write property test for name/route consistency (Property 1)
    - **Property 1: Rename derives consistent names**
    - **Validates: Requirements 1.2, 1.3**

- [x] 2. Implement `PUT /pages/:id/rename` endpoint
  - [x] 2.1 Add the rename route handler in `studio/server/api.ts`
    - Validate non-empty, non-whitespace name → 400
    - Check route collision → 409
    - Call `renamePage`, save project, broadcast `page:renamed` WebSocket event
    - Return `{ id, name, route, oldRoute }` on success
    - _Requirements: 1.1, 1.2, 1.4, 1.6, 1.7_

  - [ ]* 2.2 Write property test for rename rejection of whitespace names (Property 2)
    - **Property 2: Rename rejects invalid names**
    - **Validates: Requirements 1.6**

  - [ ]* 2.3 Write property test for rename rejection of route collisions (Property 3)
    - **Property 3: Rename rejects route collisions**
    - **Validates: Requirements 1.7**

- [x] 3. Handle `page:renamed` in Studio state
  - [x] 3.1 Add `page:renamed` WebSocket listener in `StudioProvider`
    - Apply state update to `pages` and `navigation.screens` without full reload
    - _Requirements: 1.5_

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement screen grouping in codegen
  - [x] 5.1 Add `resolveScreenPath` helper in `studio/engine/codegen/project.ts`
    - Return `src/screens/{normalizedGroup}/{ComponentName}.tsx` when page belongs to a group
    - Return flat `src/screens/{ComponentName}.tsx` otherwise
    - Normalise group name: lowercase, non-alphanumeric runs → single hyphen, strip leading/trailing hyphens
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

  - [x] 5.2 Wire `resolveScreenPath` into `generateProject` for both file output paths and `App.tsx` imports
    - _Requirements: 2.3, 2.4_

  - [ ]* 5.3 Write property test for screen path reflecting group membership (Property 6)
    - **Property 6: Screen path reflects group membership**
    - **Validates: Requirements 2.3, 2.4, 2.5**

  - [ ]* 5.4 Write property test for group name normalisation (Property 7)
    - **Property 7: Group name normalisation is consistent**
    - **Validates: Requirements 2.6**

  - [ ]* 5.5 Write property test for group deletion removing all page references (Property 8)
    - **Property 8: Group deletion removes all page references**
    - **Validates: Requirements 2.7**

  - [ ]* 5.6 Write property test for rename producing correct codegen path (Property 5)
    - **Property 5: Rename produces correct codegen path**
    - **Validates: Requirements 1.8**

- [x] 6. Enhance tab navigation codegen
  - [x] 6.1 Update the `navType === "tabs"` branch in `generateAppEntry` (`studio/engine/codegen/project.ts`)
    - Replace any `Feather` icon references with `Ionicons` from `@expo/vector-icons`
    - Use `NavigationScreen.icon ?? "ellipse"` as the icon name per screen
    - Use `NavigationScreen.name` as the tab label
    - Apply `tabBarConfig` fields to `screenOptions` (`tabBarStyle.backgroundColor`, `tabBarActiveTintColor`, `tabBarInactiveTintColor`, `tabBarShowLabel`)
    - Ensure `@react-navigation/bottom-tabs` is listed in generated `package.json`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8_

  - [ ]* 6.2 Write property test for tabs codegen correctness (Property 9)
    - **Property 9: Tabs codegen correctness**
    - **Validates: Requirements 3.1, 3.2, 3.8**

  - [ ]* 6.3 Write property test for icon rendering in tabs (Property 10)
    - **Property 10: Icon rendering in tabs and drawer**
    - **Validates: Requirements 3.3, 3.4**

  - [ ]* 6.4 Write property test for tab bar config applied to screen options (Property 11)
    - **Property 11: Tab bar config applied to screen options**
    - **Validates: Requirements 3.5**

- [x] 7. Enhance drawer navigation codegen
  - [x] 7.1 Update the `navType === "drawer"` branch in `generateAppEntry` (`studio/engine/codegen/project.ts`)
    - Add `import 'react-native-gesture-handler'` as the first line of generated `App.tsx`
    - Replace any `Feather` icon references with `Ionicons`
    - Use `NavigationScreen.name` as the drawer item label
    - Apply `drawerConfig` fields to `screenOptions` (`drawerStyle.backgroundColor`, `drawerActiveTintColor`, `drawerInactiveTintColor`, `drawerPosition`)
    - Ensure `@react-navigation/drawer` and `react-native-gesture-handler` are listed in generated `package.json`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.8_

  - [ ]* 7.2 Write property test for drawer codegen correctness (Property 12)
    - **Property 12: Drawer codegen correctness**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.8**

  - [ ]* 7.3 Write property test for drawer config applied to screen options (Property 13)
    - **Property 13: Drawer config applied to screen options**
    - **Validates: Requirements 4.5**

- [x] 8. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement bidirectional Snack sync in `SnackPanel`
  - [x] 9.1 Add Snack-to-local sync logic inside the existing `snack.addStateListener` in `studio/app/src/ui/SnackPanel.tsx`
    - Track `_lastKnownFiles` and `_pendingWrites` (debounce map) as refs
    - On each state update, diff `state.files` against `_lastKnownFiles`
    - For changed files, debounce 500 ms then `POST /api/generate/write`
    - On success update `_lastKnownFiles`, set `syncDirection('pull')`, and `setLastUpdated`
    - On failure log to console and set `syncError(true)`
    - _Requirements: 5.2, 5.4, 5.5, 5.6_

  - [x] 9.2 Add `syncDirection` state (`'push' | 'pull' | null`) and update it on local→Snack pushes too
    - Show a directional badge (↑ push / ↓ pull) in the panel UI alongside the existing timestamp
    - _Requirements: 5.8_

  - [x] 9.3 Cancel all pending debounced writes and reset `_lastKnownFiles` inside `closeSnack`
    - _Requirements: 5.7_

  - [ ]* 9.4 Write property test for Snack-to-local debounce and dedup (Property 14)
    - **Property 14: Snack-to-local debounce and dedup**
    - **Validates: Requirements 5.4, 5.5**

  - [ ]* 9.5 Write property test for Snack session cleanup stops writes (Property 15)
    - **Property 15: Snack session cleanup stops writes**
    - **Validates: Requirements 5.7**

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` (`npm install --save-dev fast-check`) with a minimum of 100 iterations each
- Each property test file should include the comment: `// Feature: studio-navigation-screen-management, Property N: <property text>`
