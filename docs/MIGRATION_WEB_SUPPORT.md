# Migration Guide: Foundation UI Web Support

## What's Changed

Foundation UI has been migrated from a dual web/native architecture to a unified React Native codebase that supports both platforms via React Native Web.

### Before (Old Architecture)
```
foundation/
├── ui/
│   ├── components/
│   │   ├── Camera/
│   │   │   ├── Camera.tsx (native)
│   │   │   └── Camera.web.tsx (web)
│   └── ...
└── web/ (separate entry point)
```

### After (New Architecture)
```
foundation/
├── ui/
│   ├── components/
│   │   └── Camera/
│   │       ├── Camera.tsx (cross-platform with web detection)
│   │       ├── Camera.logic.ts
│   │       └── Camera.style.ts
│   └── utils/
│       ├── platform.ts (platform detection)
│       └── webStyleHelpers.ts (web style conversions)
└── docs/
    └── WEB_OPTIMIZATION.md
```

## Breaking Changes

### 1. Removed Separate Web Entry Point
❌ **No longer available:**
```typescript
import { Box } from '@flipova/foundation/web';
```

✅ **Use instead:**
```typescript
import { Box } from '@flipova/foundation/ui';
// Works on both native and web
```

### 2. Updated Package Exports
The `./web` export has been removed from package.json exports.

### 3. Components Now Handle Both Platforms
All components now include platform detection and appropriate rendering logic.

## Migration Steps

### For Apps Using Foundation

#### Step 1: Update Imports
```typescript
// Before
import { Camera } from '@flipova/foundation/web';

// After
import { Camera } from '@flipova/foundation';
// OR
import { Camera } from '@flipova/foundation/ui';
```

#### Step 2: Update Web Build Configuration
If you were using separate web builds, consolidate to single build:

```diff
// vite.config.ts or webpack.config.js
const config = {
  resolve: {
    alias: {
-     '@flipova/foundation/web': '@flipova/foundation',
      '@flipova/foundation': '@flipova/foundation',
    },
  },
};
```

#### Step 3: Test Platform-Specific Features
For components with web limitations (Camera, MapView, etc.), add platform detection:

```typescript
import { isWeb } from '@flipova/foundation/ui/utils';
import { Camera, CameraFallback } from '@flipova/foundation/ui';

function CameraScreen() {
  if (isWeb) {
    return <CameraFallback />;
  }
  return <Camera />;
}
```

### For Web Applications

#### Step 1: Install Additional Dependencies
For components with web alternatives, install required libraries:

```bash
# For web video support
npm install (already built-in HTML5)

# For web animations
npm install lottie-web

# For web mapping (choose one)
npm install mapbox-gl
# OR
npm install leaflet

# For virtualized lists (optional, for performance)
npm install react-window
```

#### Step 2: Update Component Usage
Handle web-specific limitations with platform detection:

```typescript
import { isWeb } from '@flipova/foundation/ui/utils';

function MyComponent() {
  const MapComponent = isWeb 
    ? MapboxMap  // Your web implementation
    : MapView;   // Foundation MapView (native)

  return <MapComponent />;
}
```

#### Step 3: Add Web Fallback Components
For native-only features, provide web alternatives:

```typescript
import { isWeb } from '@flipova/foundation/ui/utils';
import { Camera } from '@flipova/foundation/ui';

function MyCameraComponent() {
  if (isWeb) {
    // Implement web camera using getUserMedia()
    return <WebCamera />;
  }
  return <Camera />;
}
```

## Component-Specific Migration

### Camera Component
```typescript
import { Camera, isWeb } from '@flipova/foundation/ui';

// Now works on both platforms
<Camera facing="front" />

// For web, use platform detection if needed
if (isWeb) {
  // Browser camera support available
}
```

### Video Component
```typescript
import { Video } from '@flipova/foundation/ui';

// Uses expo-video on native, HTML5 <video> on web
<Video 
  source="https://example.com/video.mp4"
  controls
  autoPlay
/>
```

### Gradient Component
```typescript
import { Gradient } from '@flipova/foundation/ui';

// Uses expo-linear-gradient on native, CSS gradient on web
<Gradient colors={['#FF0000', '#00FF00']}>
  <Text>Gradient Background</Text>
</Gradient>
```

### MapView Component
```typescript
import { MapView, isWeb } from '@flipova/foundation/ui';

if (isWeb) {
  // Use Mapbox, Leaflet, or Google Maps Web API
  return <WebMapImplementation />;
}

return <MapView latitude={40} longitude={-74} />;
```

### FlatList Component
```typescript
import { FlatList } from '@flipova/foundation/ui';

// Uses virtualized FlatList on native
// Uses ScrollView with mapped items on web
// For large web lists, consider react-window
<FlatList 
  data={items}
  renderItem={({ item }) => <Item data={item} />}
/>
```

## New Utilities and Helpers

### Platform Detection
```typescript
import {
  isWeb,
  isNative,
  isIOS,
  isAndroid,
  hasFeature,
  hasTouch,
  prefersReducedMotion,
} from '@flipova/foundation/ui/utils/platform';

if (isWeb && hasFeature('camera')) {
  // Web with camera support
}
```

### Platform-Aware Rendering
```typescript
import { usePlatformRender } from '@flipova/foundation/ui/hooks';

const Component = usePlatformRender({
  web: WebComponent,
  native: NativeComponent,
  ios: IOSComponent,
});
```

### Web Style Conversions
```typescript
import {
  applyWebStyleConversions,
  convertShadowToBoxShadow,
  convertElevationToBoxShadow,
} from '@flipova/foundation/ui/utils/webStyleHelpers';

const webStyles = applyWebStyleConversions(nativeStyles);
```

## Troubleshooting

### Issue: Old web components not rendering
**Cause**: Separate web entry point no longer exists
**Solution**: Use the unified imports, platform detection will handle the rest

### Issue: Import errors after migration
**Cause**: Path aliases may still point to old `/web` entry point
**Solution**: Update tsconfig.json and build configuration to remove `/web` paths

### Issue: Component behaves differently on web
**Cause**: Native and web APIs have different implementations
**Solution**: Use `isWeb` flag to provide platform-specific logic or fallback components

### Issue: StyleSheet warnings on web
**Cause**: Some React Native style properties don't translate directly to CSS
**Solution**: Use `applyWebStyleConversions()` utility for automatic conversion

## Verification Checklist

- [ ] All imports updated to use main entry point
- [ ] No references to `@flipova/foundation/web` remain
- [ ] Platform detection imported where needed
- [ ] Fallback components provided for native-only features
- [ ] Web-specific dependencies installed (lottie-web, mapbox-gl, etc.)
- [ ] Tested on both native and web platforms
- [ ] Build configuration updated to use single output
- [ ] Updated TypeScript paths if using path aliases
- [ ] No typecheck errors (excluding csstype library issues)
- [ ] Tests passing

## Performance Considerations

### On Native
- Virtualized rendering with FlatList
- Native animations and gestures
- Optimized memory usage

### On Web
- Consider implementing virtualization for large lists (react-window)
- Use CSS-in-JS for dynamic styling
- Optimize image loading and caching
- Monitor bundle size for web build

## Documentation

For detailed information about web optimization, see:
- [WEB_OPTIMIZATION.md](./WEB_OPTIMIZATION.md) - Complete web optimization guide
- [React Native Web docs](https://necolas.github.io/react-native-web/)

## Support

For questions or issues:
1. Check [WEB_OPTIMIZATION.md](./WEB_OPTIMIZATION.md)
2. Review component-specific documentation
3. Test with platform detection utilities
4. Check browser console for error messages
