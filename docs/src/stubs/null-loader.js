module.exports = function() {
  return `
    import React from 'react';
    
    const FallbackComp = React.forwardRef((props, ref) => {
      return React.createElement('div', { ref, 'data-stub': 'true', style: { display: 'none' } }, props.children);
    });
    
    const stub = new Proxy(FallbackComp, {
      get(target, prop) {
        if (prop === 'createAnimatedComponent') return (comp) => comp;
        if (prop === 'View' || prop === 'Text' || prop === 'Image' || prop === 'ScrollView') return FallbackComp;
        if (typeof prop === 'string' && prop.startsWith('use')) return () => ({ value: 0 });
        if (prop === 'withSpring' || prop === 'withTiming' || prop === 'withDelay') return (v) => v;
        return stub;
      }
    });
    
    // Export specific named exports used in the components
    export const Marker = FallbackComp;
    export const Callout = FallbackComp;
    export const Polygon = FallbackComp;
    export const Polyline = FallbackComp;
    
    export const BlurView = FallbackComp;
    export const LottieView = FallbackComp;
    
    export const useSharedValue = (v) => ({ value: v });
    export const useAnimatedStyle = () => ({});
    export const useDerivedValue = () => ({ value: 0 });
    export const useAnimatedProps = () => ({});
    export const useAnimatedRef = () => ({ current: null });
    export const withSpring = (v) => v;
    export const withTiming = (v) => v;
    export const createAnimatedComponent = (comp) => comp;
    
    // Export anything else that might be needed as a Proxy
    export default new Proxy(FallbackComp, {
      get(target, prop) {
        if (prop === 'createAnimatedComponent') return (comp) => comp;
        if (prop === 'Marker' || prop === 'Callout') return FallbackComp;
        return stub;
      }
    });
  `;
};
