/**
 * @role WebView Component
 * @description A container for rendering external web content or inline HTML via an iframe on the web.
 * @useCases Embedding third-party widgets, displaying external articles, or loading sandboxed content.
 * @structure Wraps an HTML `<iframe>` element within a flex container.
 * @accessibility Requires a descriptive `title` attribute on the iframe (passed via props) to ensure screen reader users understand the embedded content's purpose.
 */
import React from 'react';
import { useWebViewLogic, WebViewProps } from './WebView.logic';
import { useWebViewStyle } from './WebView.style';

const WebView: React.FC<WebViewProps> = (rawProps) => {
  const logic = useWebViewLogic(rawProps);
  const styles = useWebViewStyle(logic);

  return (
    <div style={{ ...styles.container, display: 'flex' } as React.CSSProperties} {...logic.rest}>
      {logic.source && (
        <iframe 
          src={logic.source} 
          style={{ width: '100%', height: '100%', border: 'none' }} 
        />
      )}
    </div>
  );
};

export default WebView;
