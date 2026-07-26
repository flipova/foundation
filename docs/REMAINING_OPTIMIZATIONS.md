# Remaining Component Optimizations

This document lists components that still need web optimization and provides guidance for implementation.

## High Priority (Platform-Specific APIs)

### 1. **Audio Component** ⚠️
**Current Status**: Uses `expo-av` (native-only)

**Issue**: No web implementation
- `expo-av` is not available on web
- HTML5 `<audio>` element provides native functionality

**Implementation Guide**:
```typescript
import { isWeb } from '../../utils/platform';

if (isWeb) {
  // Use HTML5 audio element
  return (
    <audio
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      style={{ width: '100%' }}
    >
      <source src={source} />
    </audio>
  );
}

// Native: use expo-av
```

**Required Dependencies**: None (HTML5 native support)

---

### 2. **FilePicker Component** ⚠️
**Current Status**: Uses `expo-document-picker` (native-only)

**Issue**: Native file picker API not available on web
- Web has `<input type="file">` element
- DocumentPicker API available but limited

**Implementation Guide**:
```typescript
import { isWeb } from '../../utils/platform';

if (isWeb) {
  // Use HTML5 file input
  return (
    <input
      type="file"
      onChange={(e) => handleFilePicked(e.target.files?.[0])}
      accept={mimeTypes?.join(',')}
      multiple={multiple}
    />
  );
}

// Native: use expo-document-picker
```

**Required Dependencies**: None

---

### 3. **DatePicker Component** ⚠️
**Current Status**: Uses `@react-native-community/datetimepicker` (native-only)

**Issue**: Different UI paradigm on web
- Native has modal date picker
- Web has HTML5 input type="date"

**Implementation Guide**:
```typescript
import { isWeb } from '../../utils/platform';

if (isWeb) {
  // Use HTML5 date input
  return (
    <input
      type="date"
      value={value?.toISOString().split('T')[0]}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  );
}

// Native: use react-native-community/datetimepicker
```

**Required Dependencies**: None

---

### 4. **BlurView Component** ⚠️
**Current Status**: Uses `expo-blur` (native-only)

**Issue**: Needs CSS backdrop-filter polyfill
- Modern browsers support `backdrop-filter`
- Fallback to opacity for older browsers

**Implementation Guide**:
```typescript
import { isWeb, supportsBackdropFilter } from '../../utils/platform';

if (isWeb) {
  const blurStyle = supportsBackdropFilter
    ? { backdropFilter: `blur(${intensity}px)` }
    : { backgroundColor: 'rgba(255, 255, 255, 0.3)' };
    
  return <View style={blurStyle}>{children}</View>;
}

// Native: use expo-blur
```

**Required Dependencies**: None (CSS native)

---

### 5. **Swiper/Carousel Components** ⚠️
**Current Status**: Uses `react-native` Animated API

**Issue**: Different gesture handling on web
- Native: Gesture responder system
- Web: Mouse/touch events

**Suggested Implementation**:
```typescript
import { Swiper, Pagination, Navigation } from 'swiper/react';
import 'swiper/css';

if (isWeb) {
  return (
    <Swiper
      slidesPerView={1}
      navigation
      pagination
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>{item}</SwiperSlide>
      ))}
    </Swiper>
  );
}
```

**Required Dependencies**: 
- `swiper` - npm install swiper

---

## Medium Priority (Performance Optimization)

### 6. **FlatList Component** (Partial) ✅
**Current Status**: Implemented with ScrollView fallback
**Optimization**: Consider react-window for virtualization

**Improvement**:
```typescript
import { FixedSizeList } from 'react-window';

if (isWeb && data.length > 100) {
  return (
    <FixedSizeList
      height={600}
      itemCount={data.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}

// Use ScrollView fallback for small lists
```

**Required Dependencies**: 
- `react-window` - npm install react-window

---

### 7. **ResponsiveLayout Component** ⚠️
**Current Status**: JavaScript window width detection

**Optimization**: Use CSS media queries
```typescript
import { isWeb } from '../../utils/platform';

if (isWeb) {
  // Use CSS media queries instead of JS window listeners
  return (
    <View style={styles.responsiveContainer}>
      {/* Let CSS handle responsiveness */}
    </View>
  );
}
```

---

## Low Priority (Minor Improvements)

### 8. **TextInput Component** ✅
**Current Status**: Basic support

**Potential Improvements**:
- Better placeholder styling on web
- Improved focus states
- Custom input type support (email, password, number, etc.)

---

### 9. **SearchInput Component** ✅
**Current Status**: Basic implementation

**Potential Improvements**:
- Debounce search on web for performance
- Add search suggestions/autocomplete
- Better mobile keyboard handling

---

### 10. **OTPInput Component** ⚠️
**Current Status**: Partial support

**Issue**: Auto-advance and OTP detection different on web

**Improvement**:
```typescript
// Web: use paste event for OTP
input.addEventListener('paste', (e) => {
  const otp = e.clipboardData.getData('text');
  if (/^\d{6}$/.test(otp)) {
    handleOtpChange(otp);
  }
});
```

---

## Implementation Priority

### Phase 1 (Immediate)
- [ ] Audio Component
- [ ] FilePicker Component
- [ ] DatePicker Component
- [ ] BlurView Component

### Phase 2 (Next Sprint)
- [ ] Swiper/Carousel Components
- [ ] FlatList Virtualization
- [ ] ResponsiveLayout CSS optimization

### Phase 3 (Polish)
- [ ] TextInput enhancements
- [ ] SearchInput improvements
- [ ] OTPInput web UX

## Testing Checklist for New Optimizations

For each optimized component, verify:

- [ ] Component renders correctly on web
- [ ] Component renders correctly on native
- [ ] No console errors or warnings
- [ ] Styles are applied correctly
- [ ] User interactions work as expected
- [ ] Fallbacks display when features unavailable
- [ ] TypeScript types are correct
- [ ] Documentation updated
- [ ] Tests passing (if applicable)

## Development Guidelines

### When Adding Web Support

1. **Import with try-catch**
   ```typescript
   let NativeComponent = null;
   if (!isWeb) {
     try {
       NativeComponent = require('native-lib');
     } catch (e) {
       // Native library not available
     }
   }
   ```

2. **Provide Fallbacks**
   ```typescript
   if (isWeb) {
     return <WebImplementation />;
   }
   if (!NativeComponent) {
     return <Fallback />;
   }
   return <NativeComponent />;
   ```

3. **Add Platform Detection Utilities**
   ```typescript
   import { hasFeature, isWeb } from '../../utils/platform';
   
   if (isWeb && !hasFeature('camera')) {
     return <Fallback />;
   }
   ```

4. **Document Web Limitations**
   Add `@web` comments in JSDoc:
   ```typescript
   /**
    * @web Uses HTML5 <audio> element instead of expo-av
    * @native Uses expo-av for optimized playback
    */
   ```

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge | Mobile |
|---------|--------|---------|--------|------|--------|
| getUserMedia (Camera) | ✅ | ✅ | ✅ | ✅ | ✅ |
| HTML5 Video | ✅ | ✅ | ✅ | ✅ | ✅ |
| backdrop-filter | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| CSS Gradients | ✅ | ✅ | ✅ | ✅ | ✅ |
| File Input | ✅ | ✅ | ✅ | ✅ | ✅ |
| Date Input | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Pointer Events | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web Audio API | ✅ | ✅ | ✅ | ✅ | ✅ |

## Resources

- [MDN Web Docs - Browser APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [Can I Use](https://caniuse.com/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [Swiper](https://swiperjs.com/)
- [React Window](https://react-window.now.sh/)
- [Lottie Web](https://airbnb.io/lottie/web.html)
