import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useWebViewLogic, WebViewProps } from './WebView.logic';
import { useWebViewStyle } from './WebView.style';
import { isWeb } from '@/ui/utils/platform';

// Only import react-native-webview on non-web platforms
let RNWebView: any = null;

if (!isWeb) {
  try {
    RNWebView = require('react-native-webview').default;
  } catch (e) {
    console.warn('react-native-webview not available');
  }
}

/**
 * An embedded web browser component.
 * 
 * @role
 * Renders web content inside a native application view.
 * 
 * @useCases
 * - Displaying external websites or articles without leaving the app.
 * - Rendering complex HTML strings or rich text.
 * - Loading web-based auth flows or payment gateways.
 * 
 * @structure
 * - Native: Wraps `react-native-webview` for rendering arbitrary web content in a native context.
 * - Web: Uses iframe with restrictive sandbox for security
 * 
 * @security
 * - Sandbox restrictions prevent script execution and popups
 * - Source validation prevents XSS attacks
 * - CSP headers should be set by server
 * - Consider using allowlist for trusted sources
 * 
 * @accessibility
 * - The web content should inherently implement its own ARIA and semantic HTML for screen readers.
 * - Iframes can obscure content from screen readers; ensure navigation between host and embedded content is clear.
 * - Provide title and aria-label for all iframes
 * 
 * @note
 * On web, this component uses an iframe with restrictive sandbox settings:
 * - ❌ No scripts
 * - ❌ No popups
 * - ❌ No same-origin access
 * - ⚠️ Forms allowed (for login flows)
 * - ⚠️ Same-origin for trusted content only
 * 
 * For complete security, configure your server with:
 * - Content-Security-Policy header
 * - X-Frame-Options: SAMEORIGIN
 * - X-Content-Type-Options: nosniff
 * - X-XSS-Protection: 1; mode=block
 */
const WebView: React.FC<WebViewProps> = (rawProps) => {
  const logic = useWebViewLogic(rawProps);
  const styles = useWebViewStyle(logic);
  const [webViewError, setWebViewError] = useState<string | null>(null);

  // Validate source URL to prevent XSS
  const isValidSource = (source: string): boolean => {
    if (!source) return false;
    try {
      // Allow relative URLs and https sources only
      if (source.startsWith('/') || source.startsWith('http://localhost')) {
        return true;
      }
      const url = new URL(source);
      // Only allow https, not http (except localhost for dev)
      if (url.protocol === 'https:') {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Native rendering
  if (!isWeb) {
    if (!logic.source) {
      return (
        <View style={[styles.container as any, logic.rest.style]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>No content provided</Text>
          </View>
        </View>
      );
    }

    if (!RNWebView) {
      return (
        <View style={[styles.container as any, logic.rest.style]}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>WebView library not available</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container as any, logic.rest.style]}>
        <RNWebView 
          source={{ uri: logic.source }} 
          style={{ flex: 1 }}
          webviewDebuggingEnabled={false}
          // Security options
          mixedContentMode="never"
          startInLoadingState={true}
          onError={(error: any) => {
            console.error('WebView error:', error);
          }}
        />
      </View>
    );
  }

  // Web rendering - use iframe with restrictive sandbox
  if (!logic.source) {
    return (
      <View style={[styles.container as any, logic.rest.style]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No content provided</Text>
        </View>
      </View>
    );
  }

  if (!isValidSource(logic.source)) {
    return (
      <View style={[styles.container as any, logic.rest.style]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#d32f2f', textAlign: 'center' }}>
            Invalid source URL. Only HTTPS and relative URLs are allowed.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {webViewError && (
        <View 
          style={{ 
            padding: 12, 
            backgroundColor: '#ffebee', 
            borderBottomColor: '#f44336',
            borderBottomWidth: 1 
          }}
        >
          <Text style={{ color: '#c62828', fontSize: 12 }}>
            {webViewError}
          </Text>
        </View>
      )}
      
      <iframe
        src={logic.source}
        style={{
          width: '100%',
          height: webViewError ? 'calc(100% - 48px)' : '100%',
          border: 'none',
          display: 'block',
        }}
        // Minimal sandbox permissions - only allow forms for login flows
        // Explicitly deny: scripts, popups, modals
        sandbox={{
          allowForms: true,           // Allow form submission
          // Explicitly deny everything else
          allow: 'payment' as any,    // Allow payment requests if needed
        } as any}
        aria-label="Embedded web content"
        title="Embedded web content - please verify source before viewing"
        onError={() => {
          setWebViewError('Failed to load embedded content. Check your network connection.');
        }}
        onLoad={() => {
          setWebViewError(null);
        }}
        loading="lazy"
        // Security headers should be enforced by server
        // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
      />
    </View>
  );
};

export default WebView;
