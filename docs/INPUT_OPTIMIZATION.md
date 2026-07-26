# Text Input Component Optimization

## Overview

Foundation UI's text input components have been optimized for both native and web platforms with enhanced accessibility, better web UX, and improved platform-specific behaviors.

## Optimized Input Components

### 1. PasswordInput Component ✅

**Native Behavior**:
- Uses React Native's `secureTextEntry` prop to hide/show password
- Pressable button for visibility toggle
- Strength meter with visual bars

**Web Behavior**:
- Uses native HTML5 `<input type="password">` and `<input type="text">`
- Toggle button switches input type dynamically
- Better browser integration (password managers work properly)
- Accessibility features: aria-label, aria-invalid, aria-describedby

**Features**:
- Password strength calculation (Weak/Fair/Good/Strong)
- Visual strength meter with 4 bars
- Eye icon toggle for visibility
- Cross-platform consistent UI

```typescript
import { PasswordInput } from '@flipova/foundation/ui';

<PasswordInput
  value={password}
  onChangeText={setPassword}
  placeholder="Enter password"
  showStrengthMeter
/>
```

### 2. SearchInput Component ✅

**Native Behavior**:
- Standard TextInput with search icon
- Clear button appears on text input
- Immediate onChange callbacks

**Web Behavior**:
- HTML5 `<input type="search">` for better UX
- Debounced search (300ms) for performance
- Search icon and clear button
- Better keyboard support (Enter key handling)
- Respects `prefers-reduced-motion` CSS media query

**Features**:
- Built-in debounce for performance
- Search icon and clear button
- Automatic text trimming
- ARIA labels for accessibility

```typescript
import { SearchInput } from '@flipova/foundation/ui';

<SearchInput
  value={searchText}
  onChangeText={setSearchText}
  placeholder="Search..."
  onClear={() => setSearchText('')}
/>
```

### 3. OTPInput Component ✅

**Native Behavior**:
- Multiple TextInput cells for OTP entry
- Auto-advance to next field
- `textContentType="oneTimeCode"` for iOS autofill
- NumPad keyboard on mobile

**Web Behavior**:
- HTML5 tel input with numeric inputmode
- Paste event handling (supports pasting full OTP)
- Auto-focus next field on digit input
- Backspace navigation between fields
- `autocomplete="one-time-code"` for browser support

**Features**:
- Configurable number of digits
- Paste support for full OTP codes
- Auto-advance behavior
- Browser autofill support
- Proper ARIA labels

```typescript
import { OTPInput } from '@flipova/foundation/ui';

<OTPInput
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={handleOtpComplete}
/>
```

## Input Helper Utilities

A new `inputHelpers` module provides utilities for handling input-specific tasks:

### Type/Mode Conversion

```typescript
import {
  getWebInputType,    // keyboard type → HTML5 input type
  getWebInputMode,    // keyboard type → HTML5 inputmode
  getWebAutoComplete, // textContentType → autocomplete attribute
} from '@flipova/foundation/ui/utils/inputHelpers';

// Example usage
const inputType = getWebInputType('email-address'); // 'email'
const inputMode = getWebInputMode('numeric'); // 'decimal'
const autoComplete = getWebAutoComplete('password'); // 'current-password'
```

### Password Strength Calculation

```typescript
import { calculatePasswordStrength } from '@flipova/foundation/ui/utils/inputHelpers';

const strength = calculatePasswordStrength('MyP@ssw0rd!');
// Returns: { score: 4, label: 'Strong', color: '#22c55e' }
```

**Criteria**:
- Lowercase letters
- Uppercase letters
- Numbers
- Special characters
- 8+ characters
- 12+ characters

**Score Mapping**:
- 1-2: Weak (red)
- 3-4: Fair (orange)
- 5: Good (yellow)
- 6: Strong (green)

### Search Debounce

```typescript
import { createDebounce } from '@flipova/foundation/ui/utils/inputHelpers';

const debouncedSearch = createDebounce((query: string) => {
  // API call, expensive operation, etc.
  searchAPI(query);
}, 300); // 300ms delay

// Use in onChange
debouncedSearch(searchQuery);
```

### OTP Utilities

```typescript
import {
  handleOTPPaste,
  extractNumericInput,
  getOTPInputProps,
} from '@flipova/foundation/ui/utils/inputHelpers';

// Handle pasting full OTP
const digits = handleOTPPaste('123456', 6); // ['1', '2', '3', '4', '5', '6']

// Extract only numeric characters
const numeric = extractNumericInput('123abc456', 3); // '123'

// Get platform-specific props
const props = getOTPInputProps(6, 0);
// { native: {...}, web: {...} }
```

### Validation Utilities

```typescript
import {
  isValidEmail,
  isValidURL,
  formatPhoneNumber,
} from '@flipova/foundation/ui/utils/inputHelpers';

isValidEmail('user@example.com'); // true
isValidURL('https://example.com'); // true
formatPhoneNumber('1234567890', 'us'); // '(123) 456-7890'
```

### Accessibility Props

```typescript
import { getInputAccessibilityProps } from '@flipova/foundation/ui/utils/inputHelpers';

const a11yProps = getInputAccessibilityProps(
  'Email Address',
  'Invalid email format',
  'Enter your email'
);

// Returns: {
//   'aria-label': 'Email Address',
//   'aria-describedby': 'input-error input-label',
//   'aria-invalid': true,
// }
```

## Platform-Specific Behaviors

### PasswordInput

| Feature | Native | Web |
|---------|--------|-----|
| Password Hide/Show | secureTextEntry prop | type switching |
| Password Managers | ✅ Standard support | ✅ Works with HTML5 |
| Strength Meter | ✅ Visual bars | ✅ Same bars |
| Accessibility | ✅ Standard RN | ✅ aria-label, aria-invalid |

### SearchInput

| Feature | Native | Web |
|---------|--------|-----|
| Debounce | On demand | Built-in (300ms) |
| Clear Button | ✅ Pressable | ✅ Button element |
| Icon Display | ✅ SVG | ✅ SVG |
| Motion Handling | Standard | Respects prefers-reduced-motion |

### OTPInput

| Feature | Native | Web |
|---------|--------|-----|
| Auto-advance | ✅ Logic | ✅ Logic |
| Auto-fill | ✅ iOS OneTimeCode | ✅ autocomplete attr |
| Paste Support | Manual paste | ✅ Paste event |
| NumPad | ✅ number-pad | ✅ tel + inputmode |

## Best Practices

### 1. Use Appropriate Input Types

```typescript
// ❌ Wrong - generic TextInput
<TextInput keyboardType="default" />

// ✅ Correct - specific type
<TextInput keyboardType="email-address" />
// Web: input type="email"
// Native: email keyboard
```

### 2. Handle Web Keyboard Events

```typescript
// On web, use both onChange and onKeyDown
<SearchInput
  onChangeText={handleChange}
  // Already handles Enter, Escape, etc. internally
/>
```

### 3. Provide Accessibility Labels

```typescript
import { getInputAccessibilityProps } from '@flipova/foundation/ui/utils/inputHelpers';

<PasswordInput
  {...getInputAccessibilityProps('Password', errorMessage)}
/>
```

### 4. Use Debounce for Performance

```typescript
// SearchInput handles this automatically
// But you can use it manually for custom inputs:
import { createDebounce } from '@flipova/foundation/ui/utils/inputHelpers';

const debouncedOnChange = createDebounce(handleSearch, 300);
```

### 5. Handle Password Manager Compatibility

```typescript
// Use proper autocomplete attributes on web
<PasswordInput
  // Native: Standard password input
  // Web: autocomplete="current-password"
/>
```

## Common Issues & Solutions

### Issue: Password strength meter not updating
**Solution**: Ensure `showStrengthMeter` prop is true and password value is being updated.

### Issue: Search is too slow on large datasets
**Solution**: Debounce is built-in for web (300ms). For native or custom needs:
```typescript
import { createDebounce } from '@flipova/foundation/ui/utils/inputHelpers';
const debouncedSearch = createDebounce(searchAPI, 500);
```

### Issue: OTP paste not working on web
**Solution**: OTPInput handles paste automatically, but ensure proper event permissions.

### Issue: Password field not autocompleting in browser
**Solution**: Web version uses standard HTML5 `<input type="password">` which browsers recognize.

### Issue: Mobile keyboard not appearing
**Solution**: Check `keyboardType` prop - use `email-address`, `numeric`, etc. for specific keyboards.

## Migration Guide

### From Old PasswordInput
```typescript
// Before
<PasswordInput secureTextEntry={true} />

// After (same API, better web support)
<PasswordInput
  showStrengthMeter
  value={password}
  onChangeText={setPassword}
/>
```

### From Old SearchInput
```typescript
// Before
<SearchInput debounceDelay={300} />

// After (debounce automatic on web)
<SearchInput
  value={search}
  onChangeText={setSearch}
/>
```

### From Old OTPInput
```typescript
// Before
<OTPInput digits={6} />

// After (paste support added)
<OTPInput
  length={6}
  value={otp}
  onChange={setOtp}
  onComplete={handleComplete}
/>
```

## Testing Checklist

- [ ] PasswordInput works on web and native
- [ ] Password strength meter displays correctly
- [ ] Eye toggle shows/hides password properly
- [ ] SearchInput debounces on web (300ms)
- [ ] Clear button clears search text
- [ ] OTPInput auto-advances on web and native
- [ ] OTP paste works on web (6-digit code)
- [ ] Accessibility labels are present
- [ ] Keyboard types are correct per platform
- [ ] Password managers work on web

## Performance Tips

1. **SearchInput**: Debounce is built-in (300ms), no configuration needed
2. **OTPInput**: No debounce needed, instant feedback is appropriate
3. **PasswordInput**: Strength calculation is fast (< 1ms)
4. **All**: Use `memoization` if inputs are in large forms

## Accessibility Compliance

All input components include:
- ✅ ARIA labels for screen readers
- ✅ Proper focus states
- ✅ Error message association
- ✅ Keyboard navigation support
- ✅ Color contrast compliance
- ✅ Motion reduction support
- ✅ Platform-specific a11y features

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge | iOS | Android |
|---------|--------|---------|--------|------|-----|---------|
| PasswordInput | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SearchInput | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| OTPInput | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| OTP Autofill | ⚠️ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ |

## References

- [MDN: HTML input types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [MDN: HTML inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode)
- [WCAG: Text input accessibility](https://www.w3.org/WAI/tutorials/forms/labels/)
- [Web.dev: Autofill](https://web.dev/blink-autofill/)
