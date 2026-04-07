# Requirements Document

## Introduction

This feature set extends Flipova Studio with five navigation and screen management capabilities:

1. **Screen Renaming** — rename a page from the studio UI, atomically updating the page name, route slug, navigation screen entry, and generated file name.
2. **Screen Grouping** — organise screens into sub-folders inside `src/screens/` (e.g. `src/screens/auth/LoginScreen.tsx`) configured via the studio and reflected in generated code.
3. **Tab Navigation** — when `navigation.type` is `"tabs"`, generate a proper bottom tab bar using `@react-navigation/bottom-tabs` with configurable icons and labels.
4. **Drawer Navigation** — when `navigation.type` is `"drawer"`, generate a proper drawer navigator using `@react-navigation/drawer` with configurable drawer items.
5. **Real-time Snack Sync** — bidirectional sync between the studio project and Expo Snack: local file writes push to Snack automatically, and Snack file edits are written back to `generated/` and broadcast to the studio.

---

## Glossary

- **Studio**: The Flipova Studio web application (`studio/app/`).
- **Server**: The Express API server (`studio/server/api.ts`).
- **Codegen**: The code generation engine (`studio/engine/codegen/project.ts`).
- **PageDocument**: A single page/screen in the project, with `id`, `name`, `route`, and `root` tree.
- **ProjectDocument**: The top-level project data structure stored in `.flipova-studio/project.json`.
- **NavigationConfig**: The `navigation` field of `ProjectDocument` — `{ type, screens }`.
- **NavigationScreen**: An entry in `NavigationConfig.screens` — `{ name, pageId, icon, options, route, ... }`.
- **ScreenGroup**: An entry in `ProjectDocument.screenGroups` — `{ id, name, type, screenIds }`.
- **Route**: The URL-safe slug derived from a page name, used as the file name and navigation key.
- **ComponentName**: The PascalCase component name derived from a page name, e.g. `LoginScreen`.
- **GeneratedFile**: A file produced by Codegen and written to `generated/`.
- **Snack**: An Expo Snack session managed via `snack-sdk`.
- **SnackPanel**: The studio UI panel (`studio/app/src/ui/SnackPanel.tsx`) that manages the Snack session.
- **WebSocket**: The real-time channel between the Server and the Studio, used for broadcasting events.
- **TabBarConfig**: The `tabBarConfig` field of `ProjectDocument` — global tab bar appearance settings.
- **DrawerConfig**: A new optional field `drawerConfig` on `ProjectDocument` — global drawer appearance settings.

---

## Requirements

### Requirement 1: Screen Renaming

**User Story:** As a studio user, I want to rename a screen from the studio UI, so that the page name, route slug, navigation entry, and generated file are all updated consistently.

#### Acceptance Criteria

1. WHEN a user submits a new name for a page, THE Server SHALL update the `PageDocument.name`, `PageDocument.route`, and the corresponding `NavigationScreen.name` atomically in a single `PUT /pages/:id/rename` request.
2. WHEN a page is renamed, THE Server SHALL derive the new route using the same `pageNameToRoute` function used at page creation, ensuring consistent slug formatting.
3. WHEN a page is renamed, THE Server SHALL derive the new component name using the same `pageNameToComponent` function used at page creation.
4. WHEN a page is renamed, THE Server SHALL broadcast a `page:renamed` WebSocket event containing `{ id, name, route, oldRoute }`.
5. WHEN the Studio receives a `page:renamed` event, THE Studio SHALL update the local `ProjectDoc` state without requiring a full project reload.
6. IF the submitted name is empty or contains only whitespace, THEN THE Server SHALL return HTTP 400 with a descriptive error message.
7. IF the submitted name results in a route that already exists on another page, THEN THE Server SHALL return HTTP 409 with a descriptive error message.
8. WHEN a page is renamed, THE Codegen SHALL generate the screen file at the new path `src/screens/{NewComponentName}.tsx` and omit the old path.

---

### Requirement 2: Screen Grouping

**User Story:** As a studio user, I want to assign screens to a named group (sub-folder), so that the generated `src/screens/` directory is organised into logical sub-folders without parentheses.

#### Acceptance Criteria

1. THE Studio SHALL allow a user to assign a page to a `ScreenGroup` by selecting a group from a list or creating a new one.
2. WHEN a page is assigned to a `ScreenGroup`, THE Server SHALL persist the `pageId` in `ScreenGroup.screenIds` within `ProjectDocument.screenGroups`.
3. WHEN Codegen generates a screen that belongs to a `ScreenGroup`, THE Codegen SHALL output the file at `src/screens/{groupName}/{ComponentName}.tsx` instead of `src/screens/{ComponentName}.tsx`.
4. WHEN Codegen generates a screen that belongs to a `ScreenGroup`, THE Codegen SHALL update all import paths in `App.tsx` to reference the sub-folder path.
5. WHEN a page is not assigned to any `ScreenGroup`, THE Codegen SHALL output the file at the flat `src/screens/{ComponentName}.tsx` path (existing behaviour).
6. THE `ScreenGroup.name` SHALL be used as the sub-folder name, lowercased and stripped of non-alphanumeric characters (e.g. `"Auth Screens"` → `auth-screens/`).
7. IF a `ScreenGroup` is deleted, THEN THE Server SHALL remove all `pageId` references from `ScreenGroup.screenIds` and regenerate affected screen paths to the flat layout.
8. THE Studio SHALL display screens grouped under their `ScreenGroup` name in the screens panel.

---

### Requirement 3: Tab Navigation

**User Story:** As a studio user, I want to configure tab navigation so that the generated app uses a proper bottom tab bar from `@react-navigation/bottom-tabs`.

#### Acceptance Criteria

1. WHEN `NavigationConfig.type` is `"tabs"`, THE Codegen SHALL generate an `App.tsx` that uses `createBottomTabNavigator` from `@react-navigation/bottom-tabs`.
2. WHEN `NavigationConfig.type` is `"tabs"`, THE Codegen SHALL include `@react-navigation/bottom-tabs` in the generated `package.json` dependencies.
3. WHEN a `NavigationScreen` has an `icon` field set, THE Codegen SHALL render the tab icon using the specified icon name via `@expo/vector-icons/Ionicons`.
4. WHEN a `NavigationScreen` has no `icon` field, THE Codegen SHALL render a default `"ellipse"` Ionicons icon for that tab.
5. WHEN `ProjectDocument.tabBarConfig` is set, THE Codegen SHALL apply `backgroundColor`, `activeTintColor`, `inactiveTintColor`, and `showLabels` to the tab bar `screenOptions`.
6. THE Studio SHALL provide a UI to configure `tabBarConfig` (background colour, active/inactive tint, label visibility) when `navigation.type` is `"tabs"`.
7. THE Studio SHALL provide a UI to set the `icon` field on each `NavigationScreen` when `navigation.type` is `"tabs"`.
8. WHEN `NavigationConfig.type` is `"tabs"`, THE Codegen SHALL use the `NavigationScreen.name` as the tab label.

---

### Requirement 4: Drawer Navigation

**User Story:** As a studio user, I want to configure drawer navigation so that the generated app uses a proper side drawer from `@react-navigation/drawer`.

#### Acceptance Criteria

1. WHEN `NavigationConfig.type` is `"drawer"`, THE Codegen SHALL generate an `App.tsx` that uses `createDrawerNavigator` from `@react-navigation/drawer`.
2. WHEN `NavigationConfig.type` is `"drawer"`, THE Codegen SHALL include `@react-navigation/drawer` and `react-native-gesture-handler` in the generated `package.json` dependencies.
3. WHEN `NavigationConfig.type` is `"drawer"`, THE Codegen SHALL add `import 'react-native-gesture-handler'` as the first import in the generated `App.tsx`.
4. WHEN a `NavigationScreen` has an `icon` field set, THE Codegen SHALL render the drawer item icon using the specified icon name via `@expo/vector-icons/Ionicons`.
5. WHEN `ProjectDocument.drawerConfig` is set, THE Codegen SHALL apply `drawerStyle`, `drawerActiveTintColor`, `drawerInactiveTintColor`, and `drawerPosition` to the drawer `screenOptions`.
6. THE Studio SHALL provide a UI to configure `drawerConfig` (background colour, active/inactive tint, drawer position) when `navigation.type` is `"drawer"`.
7. THE Studio SHALL provide a UI to set the `icon` field on each `NavigationScreen` when `navigation.type` is `"drawer"`.
8. WHEN `NavigationConfig.type` is `"drawer"`, THE Codegen SHALL use the `NavigationScreen.name` as the drawer item label.

---

### Requirement 5: Real-time Snack Sync

**User Story:** As a studio user, I want changes made locally or in Snack to be reflected in both places automatically, so that I always have a consistent live preview without manual re-uploads.

#### Acceptance Criteria

1. WHEN the Server broadcasts a `file:written` event via WebSocket, THE SnackPanel SHALL automatically fetch updated files from `POST /api/snack/export` and call `snack.updateFiles()` and `snack.updateDependencies()` without user interaction.
2. WHEN the Snack SDK state listener receives a file change from Snack (i.e. a file in `state.files` differs from the last known state), THE SnackPanel SHALL send the changed file content to `POST /api/generate/write` to persist it in `generated/`.
3. WHEN a Snack file change is written back via `POST /api/generate/write`, THE Server SHALL broadcast a `file:written` WebSocket event so other studio panels are notified.
4. THE SnackPanel SHALL debounce outbound Snack-to-local writes by at least 500 ms to avoid write storms during rapid Snack edits.
5. THE SnackPanel SHALL track the last-known Snack file state to avoid re-writing files that have not changed since the last sync cycle.
6. IF a `POST /api/generate/write` call fails, THEN THE SnackPanel SHALL log the error to the browser console and display a non-blocking warning indicator in the panel UI.
7. WHEN the Snack session is closed (via the "Close" button), THE SnackPanel SHALL stop listening for Snack file changes and cancel any pending debounced writes.
8. THE SnackPanel SHALL display a visual indicator (timestamp or "syncing" badge) whenever a bidirectional sync event occurs, distinguishing local-to-Snack pushes from Snack-to-local pulls.
