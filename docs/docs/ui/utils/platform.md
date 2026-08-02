---
title: "platform"
sidebar_label: "platform"
description: "Platform detection utilities for optimal rendering on web and native

Provides runtime platform detection, feature checking, and environment information
to enable cross-platform component rendering with proper fallbacks."
source: "ui/utils/platform.ts"
slug: "/ui/utils/platform"
---

# platform

Platform detection utilities for optimal rendering on web and native

Provides runtime platform detection, feature checking, and environment information
to enable cross-platform component rendering with proper fallbacks.

## Exported Functions & Hooks

### `getWindowDimensions`
Platform detection utilities for optimal rendering on web and native

Provides runtime platform detection, feature checking, and environment information
to enable cross-platform component rendering with proper fallbacks.
/

import { Platform } from 'react-native';

/**
Detects if the current environment is a web platform
React Native Web sets Platform.OS to 'web'
/
export const isWeb = Platform.OS === 'web';

/**
Detects if the current environment is iOS
/
export const isIOS = Platform.OS === 'ios';

/**
Detects if the current environment is Android
/
export const isAndroid = Platform.OS === 'android';

/**
Detects if the current environment is native (iOS or Android)
/
export const isNative = isIOS || isAndroid;

/**
Detects if running in browser environment
Works even if Platform.OS detection fails
/
export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
Detects if running in a Cordova environment (hybrid mobile app)
/
export const isCordova = typeof window !== 'undefined' && !!(window as any).cordova;

/**
Detects if device has touch capability
/
export const hasTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

/**
Detects if the browser supports backdrop-filter for blur effects
/
export const supportsBackdropFilter =
  typeof window !== 'undefined' &&
  CSS &&
  CSS.supports ? CSS.supports('backdrop-filter', 'blur(10px)') : false;

/**
Detects if the browser supports CSS gradients
/
export const supportsCSSGradient =
  typeof window !== 'undefined' &&
  CSS &&
  CSS.supports ? CSS.supports('background', 'linear-gradient(45deg, #000, #fff)') : false;

/**
Detects if the browser supports CSS containment
/
export const supportsCSSContainment =
  typeof window !== 'undefined' &&
  CSS &&
  CSS.supports ? CSS.supports('contain', 'layout') : false;

/**
Detects if the device prefers dark mode
/
export const prefersDarkMode =
  typeof window !== 'undefined' &&
  window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;

/**
Detects if the device prefers reduced motion
/
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

/**
Get window dimensions with fallback values for non-browser environments

```ts
getWindowDimensions()
```

### `isLandscape`
Detects if the browser/device is in landscape mode

```ts
isLandscape()
```

### `getSafeAreaInsets`
Detects if the device has a notch (safe area needed)
Works with viewport-fit=cover
/
export const hasNotch =
  typeof window !== 'undefined' &&
  typeof CSS !== 'undefined' &&
  CSS.supports ? CSS.supports('padding-top', 'max(0px, env(safe-area-inset-top))') : false;

/**
Get safe area insets from CSS env variables (only available on web)

```ts
getSafeAreaInsets()
```

### `hasFeature`
Check if a specific feature is available

```ts
hasFeature(feature: 'camera' | 'microphone' | 'geolocation' | 'webgl')
```

