# Web Support Quick Start Guide

## 🎯 TL;DR

Foundation UI now supports both React Native and Web platforms with a unified codebase. All components automatically detect the platform and render appropriately.

## 🚀 Getting Started

### 1. Update Your Imports

```typescript
// ❌ Old (no longer works)
import { Camera } from '@flipova/foundation/web';

// ✅ New (works everywhere)
import { Camera } from '@flipova/foundation/ui';
// or
import { Camera } from '@flipova/foundation';
```

### 2. Use Platform Detection

```typescript
import { isWeb } from '@flipova/foundation/ui/utils/platform';

if (isWeb) {
  console.log('Running on web');
} else {
  console.log('Running on native');
}
```

### 3. Handle Platform-Specific Features

```typescript
import { Camera, isWeb } from '@flipova/foundation/ui';

export function MyCamera() {
  // Camera uses browser API on web, expo-camera on native
  if (isWeb) {
    return <Camera />; // Uses navigator.mediaDevices.getUserMedia()
  }
  return <Camera />; // Uses expo-camera
}
```

## 📦 Key Features

### ✅ Components Optimized for Web
- **Camera** - Browser camera API (getUserMedia)
- **Video** - HTML5 `<video>` element
- **Gradient** - CSS linear-gradient
- **WebView** - HTML `<iframe>`
- **FlatList** - ScrollView fallback
- **LottieAnimation** - lottie-web support
- **KeyboardAvoidWrapper** - Pass-through on web
- **MapView** - Placeholder with guidance

### 🎛️ Platform Detection Utilities
```typescript
import {
  isWeb,              // Platform.OS === 'web'
  isNative,           // iOS or Android
  isIOS,              // Platform.OS === 'ios'
  isAndroid,          // Platform.OS === 'android'
  hasTouch,           // Device supports touch
  hasFeature,         // Check: 'camera', 'microphone', 'geolocation', 'webgl'
  supportsBackdropFilter,
  prefersDarkMode,
  prefersReducedMotion,
} from '@flipova/foundation/ui/utils/platform';
```

### 🪝 Platform Rendering Hook
```typescript
import { usePlatformRender } from '@flipova/foundation/ui/hooks';

const Component = usePlatformRender({
  web: WebComponent,
  native: NativeComponent,
  ios: IOSComponent,
  default: DefaultComponent,
});
```

### 🎨 Style Conversion Utilities
```typescript
import { applyWebStyleConversions } from '@flipova/foundation/ui/utils/webStyleHelpers';

// Automatically converts React Native styles to web CSS
const webStyles = applyWebStyleConversions(nativeStyles);
// Handles: shadows, elevation, transform, borders, etc.
```

### 🛟 Fallback Components
```typescript
import {
  CameraFallback,
  VideoFallback,
  MapViewFallback,
  LottieFallback,
  // ... more fallbacks
} from '@flipova/foundation/ui/components';

<CameraFallback /> // Shows "Camera not available"
```

## 🔧 Installation & Setup

### For Web Applications

1. **No additional setup needed** for most components:
```bash
npm install @flipova/foundation
```

2. **For animations**, install lottie-web:
```bash
npm install lottie-web
```

3. **For mapping** (optional), choose one:
```bash
npm install mapbox-gl
# OR
npm install leaflet
```

### For React Native Apps

Everything works out of the box! All native dependencies are already configured.

## 💡 Common Patterns

### Pattern 1: Conditional Rendering
```typescript
import { isWeb } from '@flipova/foundation/ui/utils/platform';
import { Camera } from '@flipova/foundation/ui';

if (isWeb) {
  return <WebCameraImplementation />;
}
return <Camera />;
```

### Pattern 2: Platform-Specific Components
```typescript
import { usePlatformRender } from '@flipova/foundation/ui/hooks';

const MyComponent = usePlatformRender({
  web: () => <WebComponent />,
  native: () => <NativeComponent />,
});
```

### Pattern 3: Feature Detection
```typescript
import { hasFeature } from '@flipova/foundation/ui/utils/platform';

if (hasFeature('camera')) {
  // Camera API available
  return <CameraApp />;
}
return <FallbackApp />;
```

### Pattern 4: Style Conversion
```typescript
import { applyWebStyleConversions } from '@flipova/foundation/ui/utils/webStyleHelpers';

const rnStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
};

const webStyle = applyWebStyleConversions(rnStyle);
// Returns: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }
```

## 🧪 Testing

### Test on Web
```bash
npm run dev      # Start web dev server
npm test        # Run tests
```

### Test on Native
```bash
expo run:ios    # iOS
expo run:android # Android
```

## 📚 Documentation

For more detailed information:

1. **[WEB_OPTIMIZATION.md](./docs/WEB_OPTIMIZATION.md)** - Comprehensive web support guide
2. **[MIGRATION_WEB_SUPPORT.md](./docs/MIGRATION_WEB_SUPPORT.md)** - Migration from old architecture
3. **[REMAINING_OPTIMIZATIONS.md](./docs/REMAINING_OPTIMIZATIONS.md)** - Future improvements
4. **[WEB_SUPPORT_SUMMARY.md](./docs/WEB_SUPPORT_SUMMARY.md)** - Complete summary

## ❓ FAQ

### Q: Why is my web component showing a placeholder?
**A:** Some components have native-only features. Use `isWeb` to detect and provide alternative implementations.

### Q: How do I optimize FlatList for large web lists?
**A:** Install `react-window` and implement virtualization:
```bash
npm install react-window
```

### Q: Do I need separate builds for web and native?
**A:** No! The unified codebase works for both platforms.

### Q: How do I handle camera access on web?
**A:** Use the Camera component—it automatically uses `navigator.mediaDevices.getUserMedia()` on web.

### Q: What about animations on web?
**A:** Install `lottie-web` and the LottieAnimation component will work seamlessly.

## ⚠️ Platform Limitations

| Feature | Web | Native | Alternative |
|---------|-----|--------|-------------|
| Camera | ✅ | ✅ | getUserMedia API |
| Video | ✅ | ✅ | HTML5 video |
| Gradient | ✅ | ✅ | CSS gradients |
| MapView | ⚠️ | ✅ | Mapbox / Leaflet |
| Animation | ✅ | ✅ | lottie-web |
| BlurView | ✅ | ✅ | backdrop-filter |
| WebView | ✅ | ✅ | iframe |

## 🐛 Troubleshooting

### Issue: Component renders blank on web
```typescript
// Check if component supports web
import { isWeb } from '@flipova/foundation/ui/utils/platform';

if (isWeb) {
  console.log('Component might need platform-specific handling');
}
```

### Issue: Styles don't match
```typescript
// Use style conversion helpers
import { applyWebStyleConversions } from '@flipova/foundation/ui/utils/webStyleHelpers';

const webStyles = applyWebStyleConversions(styles);
```

### Issue: Camera not working on web
```typescript
// Ensure browser has HTTPS and camera permission
import { hasFeature } from '@flipova/foundation/ui/utils/platform';

if (!hasFeature('camera')) {
  console.log('Camera not available in this browser');
}
```

## 🎯 Best Practices

1. **Always test on both platforms**
   ```bash
   npm run dev      # Web
   expo run:ios     # Native
   ```

2. **Use platform detection for native-only features**
   ```typescript
   if (isWeb) { /* web alternative */ }
   ```

3. **Provide graceful fallbacks**
   ```typescript
   if (!hasFeature('camera')) {
     return <CameraFallback />;
   }
   ```

4. **Optimize performance on web**
   - Use react-window for large lists
   - Implement code splitting
   - Monitor bundle size

5. **Test accessibility**
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

## 🔗 Useful Links

- [React Native Documentation](https://reactnative.dev/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Leaflet](https://leafletjs.com/)
- [Lottie Web](https://airbnb.io/lottie/web.html)

## 📞 Support

- Check [WEB_OPTIMIZATION.md](./docs/WEB_OPTIMIZATION.md) for detailed guides
- Review component-specific documentation
- Check browser console for error messages
- Use platform detection utilities for debugging

---

**Ready to build cross-platform apps with Foundation UI!** 🚀

Start with the examples above and refer to the full documentation as needed.
