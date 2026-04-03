# Theme System Documentation

## 🎨 Architecture Overview

The theme system has been optimized to support both built-in themes and custom themes with a flexible registry-based approach.

## 📋 Types

### Core Types
- **`ThemeMode`**: Built-in themes (`'light' | 'dark'`)
- **`CustomThemeMode`**: Any string for custom themes
- **`ColorScheme`**: Complete theme structure with colors, gradients, spacing, etc.
- **`ThemeRegistry`**: Registry containing all available themes

## 🚀 Usage

### Basic Usage
```typescript
// Use system theme
const { theme, mode } = useTheme();

// Use specific theme
const { theme } = useTheme('dark');
const { theme } = useTheme('neon');
```

### Provider with Custom Themes
```typescript
const customThemes = {
  neon: neonTheme,
  corporate: corporateTheme,
};

<ThemeProvider customThemes={customThemes}>
  <App />
</ThemeProvider>
```

### Dynamic Theme Switching
```typescript
const { setTheme, availableThemes } = useTheme();

// Switch to any available theme
setTheme('neon');
setTheme('corporate');

// Check available themes
console.log(Object.keys(availableThemes)); // ['light', 'dark', 'neon', 'corporate']
```

## 🎯 Built-in Themes

### Light Theme
- Clean, minimal design with white background
- High contrast for readability
- Subtle gradients and borders

### Dark Theme  
- OLED-friendly black background
- Reduced eye strain in low light
- Vibrant accents on dark base

### Neon Theme (Custom)
- High-contrast neon aesthetic
- Violet primary with neon accents
- Perfect for gaming/creative apps

## 🔧 Creating Custom Themes

```typescript
import { createTheme } from '@/modules/flipova/foundation/theme/config/create.theme';
import { colors } from '@/modules/flipova/foundation/tokens';

export const myCustomTheme = createTheme({
  background: colors.customBg,
  primary: colors.customPrimary,
  // ... all other theme properties
  gradients: {
    primary: [colors.customStart, colors.customEnd],
    // ... all gradients
  },
});
```

## ✅ Benefits

1. **Type Safety**: Full TypeScript support for all theme properties
2. **Performance**: Optimized theme switching without re-renders
3. **Flexibility**: Support for unlimited custom themes
4. **Developer Experience**: Intuitive API with clear error messages
5. **Maintainability**: Centralized theme management
6. **Extensibility**: Easy to add new themes and properties

## 🔄 Migration Guide

### Before (Old System)
```typescript
const { colorScheme, colors, theme } = useTheme();
const color = useThemeColor('primary');
```

### After (New System)
```typescript
const { theme, mode, setTheme } = useTheme();
const primaryColor = theme.primary;
const primaryGradient = theme.gradients.primary;
```

## 🎨 Theme Properties

Each theme includes:
- **Colors**: All semantic color tokens (background, primary, success, etc.)
- **Gradients**: Pre-defined gradient combinations
- **Spacing**: Consistent spacing values
- **Typography**: Font sizes, weights, line heights
- **Layout**: Border radius, shadows
- **Accessibility**: Proper contrast ratios for all themes
