---
title: "inputHelpers"
sidebar_label: "inputHelpers"
description: "Helper utilities for cross-platform text input components

Provides utilities for normalizing keyboard types, input modes, and other
input-specific behaviors across native and web platforms."
source: "ui/utils/inputHelpers.ts"
slug: "/ui/utils/inputHelpers"
---

# inputHelpers

Helper utilities for cross-platform text input components

Provides utilities for normalizing keyboard types, input modes, and other
input-specific behaviors across native and web platforms.

## Interfaces & Types

### `FileValidationResult`
Helper utilities for cross-platform text input components

Provides utilities for normalizing keyboard types, input modes, and other
input-specific behaviors across native and web platforms.
/

import &#123; isWeb &#125; from './platform';

/**
Map React Native keyboard types to HTML5 input types for web
/
export const getWebInputType = (keyboardType?: string): string =&gt; &#123;
  if (!isWeb) return 'text';

  switch (keyboardType) &#123;
    case 'email-address':
      return 'email';
    case 'numeric':
      return 'number';
    case 'phone-pad':
      return 'tel';
    case 'url':
      return 'url';
    case 'decimal-pad':
      return 'number';
    case 'number-pad':
      return 'number';
    default:
      return 'text';
  &#125;
&#125;;

/**
Map React Native inputMode prop to HTML5 inputmode attribute
/
export const getWebInputMode = (keyboardType?: string): string =&gt; &#123;
  if (!isWeb) return 'text';

  switch (keyboardType) &#123;
    case 'numeric':
    case 'number-pad':
    case 'decimal-pad':
      return 'decimal';
    case 'phone-pad':
      return 'tel';
    case 'email-address':
      return 'email';
    case 'url':
      return 'url';
    case 'search':
      return 'search';
    default:
      return 'text';
  &#125;
&#125;;

/**
Get proper autocomplete attribute for input type
/
export const getWebAutoComplete = (textContentType?: string, keyboardType?: string): string | undefined =&gt; &#123;
  if (!isWeb) return undefined;

  switch (textContentType) &#123;
    case 'username':
      return 'username';
    case 'password':
      return 'current-password';
    case 'email':
      return 'email';
    case 'telephoneNumber':
      return 'tel';
    case 'streetAddressLine1':
      return 'street-address';
    case 'creditCardNumber':
      return 'cc-number';
    case 'creditCardExpiration':
      return 'cc-exp';
    case 'creditCardSecurityCode':
      return 'cc-csc';
    case 'oneTimeCode':
      return 'one-time-code';
    case 'url':
      return 'url';
    default:
      return undefined;
  &#125;
&#125;;

/**
Calculate password strength (for PasswordInput)
Uses common heuristics:
- Length: &gt;8, &gt;12, &gt;16 chars
- Complexity: lowercase, uppercase, numbers, special chars
/
export const calculatePasswordStrength = (password: string): &#123;
  score: number;
  label: string;
  color: string;
&#125; =&gt; &#123;
  if (!password) return &#123; score: 0, label: '', color: '#d0d0d0' &#125;;

  let score = 0;
  const checks = &#123;
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&amp;*()_+\-=\[\]&#123;&#125;;':"\\|,.&lt;&gt;\/?]/.test(password),
    isLongEnough: password.length &gt;= 8,
    isVeryLong: password.length &gt;= 12,
  &#125;;

  // Add points for each criteria
  if (checks.hasLowercase) score += 1;
  if (checks.hasUppercase) score += 1;
  if (checks.hasNumbers) score += 1;
  if (checks.hasSpecialChar) score += 1;
  if (checks.isLongEnough) score += 1;
  if (checks.isVeryLong) score += 1;

  // Normalize to 0-4 scale
  const normalizedScore = Math.ceil(score / 1.5);

  if (normalizedScore &lt;= 1) &#123;
    return &#123; score: 1, label: 'Weak', color: '#ef4444' &#125;;
  &#125; else if (normalizedScore &lt;= 2) &#123;
    return &#123; score: 2, label: 'Fair', color: '#f97316' &#125;;
  &#125; else if (normalizedScore &lt;= 3) &#123;
    return &#123; score: 3, label: 'Good', color: '#eab308' &#125;;
  &#125; else &#123;
    return &#123; score: 4, label: 'Strong', color: '#22c55e' &#125;;
  &#125;
&#125;;

/**
Debounce function for search input
Delays function execution until timeout passes without new calls
/
export const createDebounce = &lt;T extends (...args: any[]) =&gt; any&gt;(
  fn: T,
  delay: number = 300
): ((...args: Parameters&lt;T&gt;) =&gt; void) =&gt; &#123;
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters&lt;T&gt;) &#123;
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() =&gt; &#123;
      fn(...args);
      timeoutId = null;
    &#125;, delay);
  &#125;;
&#125;;

/**
Generate OTP input attributes for better mobile/web UX
/
export const getOTPInputProps = (length: number, index: number) =&gt; &#123;
  return &#123;
    native: &#123;
      keyboardType: 'number-pad' as const,
      textContentType: 'oneTimeCode' as const,
      autoComplete: 'one-time-code' as const,
      maxLength: 1,
    &#125;,
    web: &#123;
      type: 'tel',
      inputMode: 'numeric' as const,
      autoComplete: 'one-time-code',
      maxLength: 1,
      pattern: '[0-9]',
      // Allow pasting full OTP (will be handled in logic)
      onPaste: true,
    &#125;,
  &#125;;
&#125;;

/**
Extract numeric value from input (for OTP, PIN)
/
export const extractNumericInput = (text: string, maxLength: number = 1): string =&gt; &#123;
  // Remove non-numeric characters
  const numeric = text.replace(/\D/g, '');
  // Limit to maxLength
  return numeric.slice(0, maxLength);
&#125;;

/**
Handle paste event for OTP input
Extracts numbers and distributes across cells
/
export const handleOTPPaste = (pastedText: string, length: number): string[] =&gt; &#123;
  const digits = pastedText.replace(/\D/g, '').split('').slice(0, length);
  return digits;
&#125;;

/**
Get appropriate cursor position for input
/
export const getInputCursorStyle = (focused: boolean): string =&gt; &#123;
  if (!isWeb) return 'auto';
  return focused ? 'text' : 'pointer';
&#125;;

/**
Validate email format
/
export const isValidEmail = (email: string): boolean =&gt; &#123;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
&#125;;

/**
Validate URL format
/
export const isValidURL = (url: string): boolean =&gt; &#123;
  try &#123;
    new URL(url);
    return true;
  &#125; catch &#123;
    return false;
  &#125;
&#125;;

/**
Format phone number
/
export const formatPhoneNumber = (phone: string, format: string = 'intl'): string =&gt; &#123;
  const cleaned = phone.replace(/\D/g, '');

  if (format === 'us' &amp;&amp; cleaned.length === 10) &#123;
    return `($&#123;cleaned.slice(0, 3)&#125;) $&#123;cleaned.slice(3, 6)&#125;-$&#123;cleaned.slice(6)&#125;`;
  &#125;

  return cleaned;
&#125;;

/**
Get text input accessibility props
/
export const getInputAccessibilityProps = (
  label?: string,
  error?: string,
  placeholder?: string
) =&gt; &#123;
  const ariaLabel = label || placeholder;
  const ariaDescribedBy: string[] = [];

  if (error) &#123;
    ariaDescribedBy.push('input-error');
  &#125;
  if (label) &#123;
    ariaDescribedBy.push('input-label');
  &#125;

  return &#123;
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy.length &gt; 0 ? ariaDescribedBy.join(' ') : undefined,
    'aria-invalid': !!error,
  &#125;;
&#125;;

/**
File validation result

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `valid` | `boolean` | – | – |
| `error` *(optional)* | `string` | – | – |

### `FileValidationOptions`
Validate file size in bytes

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `maxSizeInMB` *(optional)* | `number` | – | – |
| `allowedMimeTypes` *(optional)* | `string[]` | – | – |
| `allowedExtensions` *(optional)* | `string[]` | – | – |

## Exported Functions & Hooks

### `getWebInputType`
Helper utilities for cross-platform text input components

Provides utilities for normalizing keyboard types, input modes, and other
input-specific behaviors across native and web platforms.
/

import { isWeb } from './platform';

/**
Map React Native keyboard types to HTML5 input types for web

```ts
getWebInputType(keyboardType?: string): string
```

### `getWebInputMode`
Map React Native inputMode prop to HTML5 inputmode attribute

```ts
getWebInputMode(keyboardType?: string): string
```

### `getWebAutoComplete`
Get proper autocomplete attribute for input type

```ts
getWebAutoComplete(textContentType?: string, keyboardType?: string): string | undefined
```

### `calculatePasswordStrength`
Calculate password strength (for PasswordInput)
Uses common heuristics:
- Length: >8, >12, >16 chars
- Complexity: lowercase, uppercase, numbers, special chars

```ts
calculatePasswordStrength(password: string):
```

### `getOTPInputProps`
Debounce function for search input
Delays function execution until timeout passes without new calls
/
export const createDebounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

/**
Generate OTP input attributes for better mobile/web UX

```ts
getOTPInputProps(length: number, index: number)
```

### `extractNumericInput`
Extract numeric value from input (for OTP, PIN)

```ts
extractNumericInput(text: string, maxLength: number = 1): string
```

### `handleOTPPaste`
Handle paste event for OTP input
Extracts numbers and distributes across cells

```ts
handleOTPPaste(pastedText: string, length: number): string[]
```

### `getInputCursorStyle`
Get appropriate cursor position for input

```ts
getInputCursorStyle(focused: boolean): string
```

### `isValidEmail`
Validate email format

```ts
isValidEmail(email: string): boolean
```

### `isValidURL`
Validate URL format

```ts
isValidURL(url: string): boolean
```

### `formatPhoneNumber`
Format phone number

```ts
formatPhoneNumber(phone: string, format: string = 'intl'): string
```

### `getInputAccessibilityProps`
Get text input accessibility props

```ts
getInputAccessibilityProps(
  label?: string,
  error?: string,
  placeholder?: string
)
```

