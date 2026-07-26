# Web Optimization Guide for React Native Components

This guide documents the optimizations made to the Foundation UI component library for better web compatibility using React Native Web.

## Overview

All components in the Foundation library now support both native (iOS/Android) and web platforms. Components that rely on native-only libraries or APIs have been updated with web-compatible fallbacks.

## Platform Detection Utilities

### `isWeb`
Detects if the current environment is a web platform.

```typescript
import { isWeb } from '@flipova/foundation/ui/utils/platform';

if (isWeb) {
  // Web-specific logic
} else {
  // Native-specific logic
}
```

### Platform Detection Helpers

```typescript
import {
  isWeb,        // Platform.OS === 'web'
  isNative,     // iOS or Android
  isIOS,        // Platform.OS === 'ios'
  isAndroid,    // Platform.OS === 'android'
  isBrowser,    // Browser environment check
  hasTouch,     // Device supports touch
  hasFeature,   // Check for feature availability (camera, microphone, etc.)
} from '@flipova/foundation/ui/utils/platform';
```

## Hook for Platform-Specific Rendering

Use the `usePlatformRender` hook to render different components based on the platform:

```typescript
import { usePlatformRender } from '@flipova/foundation/ui/hooks';

function MyComponent() {
  const Component = usePlatformRender({
    web: WebComponent,
    native: NativeComponent,
    ios: IOSSpecificComponent,
    default: DefaultComponent,
  });

  return <Component />;
}
```

## Optimized Components

### Components with Web Fallbacks

These components have been updated to handle web and native environments:

#### 1. **Camera**
- **Native**: Uses `expo-camera` for native device camera access
- **Web**: Uses browser `MediaDevices.getUserMedia()` API
- **Fallback**: Shows message if camera not available

```typescript
import { Camera } from '@flipova/foundation/ui';

<Camera facing="front" />
```

#### 2. **Video**
- **Native**: Uses `expo-video` VideoView
- **Web**: Uses HTML5 `<video>` element
- **Features**: Supports controls, autoplay, loop, muted

```typescript
import { Video } from '@flipova/foundation/ui';

<Video 
  source="https://example.com/video.mp4" 
  controls 
  autoPlay 
/>
```

#### 3. **Gradient**
- **Native**: Uses `expo-linear-gradient`
- **Web**: Uses CSS `linear-gradient()` with angle conversion
- **Automatic**: Converts React Native coordinates to CSS angles

```typescript
import { Gradient } from '@flipova/foundation/ui';

<Gradient 
  colors={['#FF0000', '#00FF00']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <Text>Gradient Content</Text>
</Gradient>
```

#### 4. **WebView**
- **Native**: Uses `react-native-webview`
- **Web**: Uses HTML `<iframe>` element
- **Sandboxing**: Iframe uses sandbox attribute for security

```typescript
import { WebView } from '@flipova/foundation/ui';

<WebView source="https://example.com" />
```

#### 5. **MapView**
- **Native**: Uses `react-native-maps` with Google Maps
- **Web**: Shows placeholder with guidance
- **Note**: Implement with Mapbox, Leaflet, or Google Maps Web API

```typescript
import { MapView } from '@flipova/foundation/ui';

<MapView latitude={40} longitude={-74} zoom={10} />
```

#### 6. **FlatList**
- **Native**: Uses virtualized React Native FlatList
- **Web**: Uses ScrollView with mapped items
- **Note**: For large lists, consider implementing virtualization with react-window

```typescript
import { FlatList } from '@flipova/foundation/ui';

<FlatList 
  data={items}
  renderItem={({ item }) => <Item data={item} />}
/>
```

#### 7. **LottieAnimation**
- **Native**: Uses `lottie-react-native`
- **Web**: Uses `lottie-web` library (requires installation)
- **Setup**: Install lottie-web for web support

```bash
npm install lottie-web
```

```typescript
import { LottieAnimation } from '@flipova/foundation/ui';

<LottieAnimation source={require('./animation.json')} />
```

#### 8. **KeyboardAvoidWrapper**
- **Native**: Uses `KeyboardAvoidingView` for keyboard handling
- **Web**: Passes through as regular View (no keyboard layout shift)

```typescript
import { KeyboardAvoidWrapper } from '@flipova/foundation/ui';

<KeyboardAvoidWrapper offset={16}>
  {/* Input fields */}
</KeyboardAvoidWrapper>
```

#### 9. **BlurView**
- **Native**: Uses `expo-blur`
- **Web**: CSS `backdrop-filter` or opacity fallback
- **Note**: Add feature detection for older browsers

#### 10. **Audio**
- **Native**: Uses `expo-av`
- **Web**: Uses HTML5 `<audio>` element
- **Note**: Implement custom controls if needed

## Style Conversion Utilities

The `webStyleHelpers` module provides utilities for converting React Native styles to web CSS:

```typescript
import {
  convertShadowToBoxShadow,     // RN shadow → CSS box-shadow
  convertBorderRadius,           // Border radius conversion
  convertElevationToBoxShadow,   // Android elevation → shadow
  convertTransformToCSS,         // Transform array → CSS string
  applyWebStyleConversions,      // Apply all conversions
  getCursorStyle,                // Cursor handling
  flexboxConverter,              // Flexbox prop conversion
} from '@flipova/foundation/ui/utils/webStyleHelpers';

const webStyles = applyWebStyleConversions(nativeStyles);
```

### Example: Converting Shadows

```typescript
const nativeStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
};

const webStyle = convertShadowToBoxShadow(nativeStyle);
// Result: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }
```

## Web Fallback Components

Fallback components are provided for native-only features:

```typescript
import {
  WebUnsupportedFallback,
  CameraFallback,
  VideoFallback,
  MapViewFallback,
  LottieFallback,
  GradientFallback,
  BlurViewFallback,
  AudioFallback,
  FilePickerFallback,
} from '@flipova/foundation/ui/components';

// Use in conditional rendering
import { isWeb } from '@flipova/foundation/ui/utils/platform';

function CustomMapComponent() {
  if (isWeb) {
    return <MapViewFallback />;
  }
  return <NativeMapComponent />;
}
```

## Best Practices

### 1. Test on Both Platforms
Always test components on both native and web:

```bash
# Test native iOS
expo run:ios

# Test web
npm run dev
```

### 2. Use Platform Detection
Import and use platform detection for custom logic:

```typescript
import { isWeb, hasFeature } from '@flipova/foundation/ui/utils/platform';

if (isWeb && hasFeature('camera')) {
  // Web with camera support
}
```

### 3. Handle Missing Features Gracefully
Always provide fallbacks for unavailable features:

```typescript
function CameraComponent() {
  if (!hasFeature('camera')) {
    return <CameraFallback />;
  }
  return <Camera />;
}
```

### 4. Optimize Large Lists
On web, consider implementing virtualization for large lists:

```typescript
import { FixedSizeList } from 'react-window';

function OptimizedList({ items }) {
  if (isWeb) {
    return (
      <FixedSizeList
        height={600}
        itemCount={items.length}
        itemSize={50}
      >
        {({ index, style }) => (
          <div style={style}>{items[index]}</div>
        )}
      </FixedSizeList>
    );
  }
  return <FlatList data={items} renderItem={renderItem} />;
}
```

### 5. Use CSS-in-JS for Web
When styling for web, consider using CSS-in-JS for better maintainability:

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  gradient: {
    background: 'linear-gradient(45deg, #FF0000, #00FF00)',
  },
});
```

### 6. Handle Permissions
Web APIs require different permission handling:

```typescript
async function requestCameraPermission() {
  if (isWeb) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      });
      return true;
    } catch (error) {
      console.error('Camera access denied');
      return false;
    }
  } else {
    // Native permission handling
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  }
}
```

## Upcoming Improvements

Future optimizations planned:

1. **Virtual scrolling for FlatList on web** - Better performance for large lists
2. **Improved mapping support** - Integration with Mapbox/Leaflet
3. **Touch gesture improvements** - Better gesture handling on web
4. **Animation optimizations** - Improved lottie-web integration
5. **Accessibility enhancements** - Better ARIA labels and keyboard navigation

## Troubleshooting

### Issue: Component renders blank on web
**Solution**: Check if platform-specific library is available. Use web fallback component.

### Issue: Styles don't match on web and native
**Solution**: Use `applyWebStyleConversions()` to normalize styles, test shadow and elevation properties.

### Issue: Camera doesn't work on web
**Solution**: Ensure browser has camera permission and supports getUserMedia API. Check browser console for HTTPS requirement.

### Issue: Animations not playing on web
**Solution**: Install lottie-web, verify animations are loaded from correct path, check browser console for errors.

## Resources

- [React Native Web Documentation](https://necolas.github.io/react-native-web/)
- [React Native API Reference](https://reactnative.dev/docs/getting-started)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Leaflet Documentation](https://leafletjs.com/)
- [Lottie Web Documentation](https://airbnb.io/lottie/web.html)
