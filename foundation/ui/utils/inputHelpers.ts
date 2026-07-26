/**
 * @module inputHelpers
 * @description Helper utilities for cross-platform text input components
 * 
 * Provides utilities for normalizing keyboard types, input modes, and other
 * input-specific behaviors across native and web platforms.
 */

import { isWeb } from './platform';

/**
 * Map React Native keyboard types to HTML5 input types for web
 */
export const getWebInputType = (keyboardType?: string): string => {
  if (!isWeb) return 'text';

  switch (keyboardType) {
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
  }
};

/**
 * Map React Native inputMode prop to HTML5 inputmode attribute
 */
export const getWebInputMode = (keyboardType?: string): string => {
  if (!isWeb) return 'text';

  switch (keyboardType) {
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
  }
};

/**
 * Get proper autocomplete attribute for input type
 */
export const getWebAutoComplete = (textContentType?: string, keyboardType?: string): string | undefined => {
  if (!isWeb) return undefined;

  switch (textContentType) {
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
  }
};

/**
 * Calculate password strength (for PasswordInput)
 * Uses common heuristics:
 * - Length: >8, >12, >16 chars
 * - Complexity: lowercase, uppercase, numbers, special chars
 */
export const calculatePasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  if (!password) return { score: 0, label: '', color: '#d0d0d0' };

  let score = 0;
  const checks = {
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    isLongEnough: password.length >= 8,
    isVeryLong: password.length >= 12,
  };

  // Add points for each criteria
  if (checks.hasLowercase) score += 1;
  if (checks.hasUppercase) score += 1;
  if (checks.hasNumbers) score += 1;
  if (checks.hasSpecialChar) score += 1;
  if (checks.isLongEnough) score += 1;
  if (checks.isVeryLong) score += 1;

  // Normalize to 0-4 scale
  const normalizedScore = Math.ceil(score / 1.5);

  if (normalizedScore <= 1) {
    return { score: 1, label: 'Weak', color: '#ef4444' };
  } else if (normalizedScore <= 2) {
    return { score: 2, label: 'Fair', color: '#f97316' };
  } else if (normalizedScore <= 3) {
    return { score: 3, label: 'Good', color: '#eab308' };
  } else {
    return { score: 4, label: 'Strong', color: '#22c55e' };
  }
};

/**
 * Debounce function for search input
 * Delays function execution until timeout passes without new calls
 */
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
 * Generate OTP input attributes for better mobile/web UX
 */
export const getOTPInputProps = (length: number, index: number) => {
  return {
    native: {
      keyboardType: 'number-pad' as const,
      textContentType: 'oneTimeCode' as const,
      autoComplete: 'one-time-code' as const,
      maxLength: 1,
    },
    web: {
      type: 'tel',
      inputMode: 'numeric' as const,
      autoComplete: 'one-time-code',
      maxLength: 1,
      pattern: '[0-9]',
      // Allow pasting full OTP (will be handled in logic)
      onPaste: true,
    },
  };
};

/**
 * Extract numeric value from input (for OTP, PIN)
 */
export const extractNumericInput = (text: string, maxLength: number = 1): string => {
  // Remove non-numeric characters
  const numeric = text.replace(/\D/g, '');
  // Limit to maxLength
  return numeric.slice(0, maxLength);
};

/**
 * Handle paste event for OTP input
 * Extracts numbers and distributes across cells
 */
export const handleOTPPaste = (pastedText: string, length: number): string[] => {
  const digits = pastedText.replace(/\D/g, '').split('').slice(0, length);
  return digits;
};

/**
 * Get appropriate cursor position for input
 */
export const getInputCursorStyle = (focused: boolean): string => {
  if (!isWeb) return 'auto';
  return focused ? 'text' : 'pointer';
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string, format: string = 'intl'): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (format === 'us' && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return cleaned;
};

/**
 * Get text input accessibility props
 */
export const getInputAccessibilityProps = (
  label?: string,
  error?: string,
  placeholder?: string
) => {
  const ariaLabel = label || placeholder;
  const ariaDescribedBy: string[] = [];

  if (error) {
    ariaDescribedBy.push('input-error');
  }
  if (label) {
    ariaDescribedBy.push('input-label');
  }

  return {
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy.length > 0 ? ariaDescribedBy.join(' ') : undefined,
    'aria-invalid': !!error,
  };
};

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file size in bytes
 * @param file - File object (or file-like object with size property)
 * @param maxSizeInMB - Maximum file size in MB
 */
export const validateFileSize = (file: { size: number } | File, maxSizeInMB: number): FileValidationResult => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeInMB}MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }
  
  return { valid: true };
};

/**
 * Validate file MIME type against allowed types
 * @param file - File object
 * @param allowedMimeTypes - Array of allowed MIME types (supports wildcards like 'image/*')
 */
export const validateFileMimeType = (
  file: { type: string } | File,
  allowedMimeTypes: string[]
): FileValidationResult => {
  if (!allowedMimeTypes || allowedMimeTypes.length === 0) {
    return { valid: true };
  }

  const fileMimeType = file.type || '';
  
  const isAllowed = allowedMimeTypes.some((mimeType) => {
    if (mimeType === '*/*') {
      return true;
    }
    
    if (mimeType.endsWith('/*')) {
      // Handle wildcard MIME types (e.g., 'image/*')
      const [type] = mimeType.split('/');
      return fileMimeType.startsWith(`${type}/`);
    }
    
    return fileMimeType === mimeType;
  });

  if (!isAllowed) {
    return {
      valid: false,
      error: `File type '${fileMimeType || 'unknown'}' is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Validate file extension against allowed extensions
 * @param file - File object or filename
 * @param allowedExtensions - Array of allowed file extensions (without dot, e.g., ['pdf', 'doc'])
 */
export const validateFileExtension = (
  file: { name: string } | File | string,
  allowedExtensions: string[]
): FileValidationResult => {
  if (!allowedExtensions || allowedExtensions.length === 0) {
    return { valid: true };
  }

  const filename = typeof file === 'string' ? file : file.name || '';
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const isAllowed = allowedExtensions.some(
    (ext) => ext.toLowerCase() === extension
  );

  if (!isAllowed) {
    return {
      valid: false,
      error: `File extension '.${extension}' is not allowed. Allowed extensions: ${allowedExtensions.map(e => `.${e}`).join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Comprehensive file validation
 */
export interface FileValidationOptions {
  maxSizeInMB?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

export const validateFile = (
  file: any,
  options: FileValidationOptions = {}
): FileValidationResult => {
  const { maxSizeInMB, allowedMimeTypes, allowedExtensions } = options;

  // Check file size
  if (maxSizeInMB !== undefined) {
    const sizeResult = validateFileSize(file, maxSizeInMB);
    if (!sizeResult.valid) return sizeResult;
  }

  // Check MIME type
  if (allowedMimeTypes && allowedMimeTypes.length > 0) {
    const mimeResult = validateFileMimeType(file, allowedMimeTypes);
    if (!mimeResult.valid) return mimeResult;
  }

  // Check extension
  if (allowedExtensions && allowedExtensions.length > 0) {
    const extResult = validateFileExtension(file, allowedExtensions);
    if (!extResult.valid) return extResult;
  }

  return { valid: true };
};
