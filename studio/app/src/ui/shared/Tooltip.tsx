/**
 * Tooltip — Help bubble shown on hover with a configurable delay.
 *
 * - Appears after `delay` ms (default 500ms) on hover
 * - Automatically repositions to avoid right/bottom edge overflow
 * - Web-only: on native, renders children without tooltip
 */
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { computeTooltipPosition, type TooltipPosition } from './tooltipUtils';

export type { TooltipPosition };
export { computeTooltipPosition };

export interface TooltipProps {
  /** Tooltip text content */
  text: string;
  /** Element that triggers the tooltip */
  children: React.ReactNode;
  /** Delay in ms before showing the tooltip (default: 500) */
  delay?: number;
}

const TOOLTIP_WIDTH = 200;
const TOOLTIP_HEIGHT = 36;

const Tooltip: React.FC<TooltipProps> = ({ text, children, delay = 500 }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anchorRef = useRef<View | null>(null);

  const show = useCallback(() => {
    if (Platform.OS !== 'web') return;
    timerRef.current = setTimeout(() => {
      if (anchorRef.current) {
        const dom = anchorRef.current as any;
        if (dom.getBoundingClientRect) {
          const rect = dom.getBoundingClientRect();
          const pos = computeTooltipPosition(
            rect,
            TOOLTIP_WIDTH,
            TOOLTIP_HEIGHT,
            window.innerWidth,
            window.innerHeight,
          );
          setPosition(pos);
        }
      }
      setVisible(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View
      ref={anchorRef}
      style={s.wrapper}
      // @ts-ignore — web-only event props
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <View
          style={[
            s.bubble,
            { top: position.top, left: position.left, position: 'fixed' as any },
          ]}
          // @ts-ignore
          pointerEvents="none"
        >
          <Text style={s.text} numberOfLines={2}>{text}</Text>
        </View>
      )}
    </View>
  );
};

export default Tooltip;

const s = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  bubble: {
    backgroundColor: '#1a2240',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: TOOLTIP_WIDTH,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    color: '#d0d8f0',
    fontSize: 11,
    lineHeight: 16,
  },
});
