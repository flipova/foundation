import React from 'react';
import { View } from 'react-native';
import { useWebViewLogic, WebViewProps } from './WebView.logic';
import { useWebViewStyle } from './WebView.style';
import RNWebView from 'react-native-webview';

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
 * - Wraps `react-native-webview` inside a `View` container.
 * 
 * @accessibility
 * - The web content should inherently implement its own ARIA and semantic HTML for screen readers.
 */
const WebView: React.FC<WebViewProps> = (rawProps) => {
  const logic = useWebViewLogic(rawProps);
  const styles = useWebViewStyle(logic);

  return (
    <View style={[styles.container as any, logic.rest.style]}>
      {logic.source && (
        <RNWebView source={{ uri: logic.source }} style={{ flex: 1 }} />
      )}
    </View>
  );
};

export default WebView;
