/**
 * ResizeHandle — Draggable divider for resizable panels.
 * Web-only (uses mouse events). On native, renders nothing.
 *
 * Requirements: 16.7 — shows a size badge during drag
 */
import React, { useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { colors as C } from '../ds/colors';

interface Props {
  /** 'left' = dragging resizes the panel to the left of the handle */
  side: 'left' | 'right';
  onResize: (delta: number) => void;
  /** Visual orientation */
  vertical?: boolean;
  /** Current panel size in px — shown in badge during drag */
  currentSize?: number;
}

const ResizeHandle: React.FC<Props> = ({ side, onResize, vertical = false, currentSize }) => {
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [liveSize, setLiveSize] = useState<number | undefined>(currentSize);

  const handleRef = useCallback((el: View | null) => {
    if (!el || Platform.OS !== 'web') return;
    const dom = el as any;
    if (!dom.addEventListener) return;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      setIsDragging(true);
      document.body.style.cursor = vertical ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        if (vertical) {
          const dy = ev.clientY - lastY.current;
          lastY.current = ev.clientY;
          onResize(side === 'left' ? dy : -dy);
        } else {
          const dx = ev.clientX - lastX.current;
          lastX.current = ev.clientX;
          onResize(side === 'left' ? dx : -dx);
        }
      };

      const onMouseUp = () => {
        dragging.current = false;
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    dom.addEventListener('mousedown', onMouseDown);
    return () => dom.removeEventListener('mousedown', onMouseDown);
  }, [side, onResize, vertical]);

  // Keep liveSize in sync with currentSize prop
  React.useEffect(() => {
    setLiveSize(currentSize);
  }, [currentSize]);

  if (Platform.OS !== 'web') return null;

  const showBadge = isDragging && liveSize !== undefined;

  return (
    <View 
      ref={handleRef} 
      style={[s.handle, vertical && s.handleV]}
      // @ts-ignore
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <View style={[
        s.line, 
        vertical ? s.lineV : s.lineH,
        (isHovered || isDragging) && { backgroundColor: C.primary }
      ]} />
      
      {showBadge && (
        <View style={[s.badge, vertical ? s.badgeV : s.badgeH]}>
          <Text style={s.badgeText}>
            {Math.round(liveSize!)}px
          </Text>
        </View>
      )}
    </View>
  );
};

export default ResizeHandle;

const s = StyleSheet.create({
  handle: {
    width: 6,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    cursor: 'col-resize' as any,
    zIndex: 100,
    position: 'relative',
  },
  handleV: { width: '100%' as any, height: 6, flexDirection: 'column', cursor: 'row-resize' as any },
  
  line: {
    backgroundColor: 'transparent',
    transitionDuration: '0.2s',
    transitionProperty: 'background-color',
  },
  lineH: {
    width: 2,
    height: '100%',
  },
  lineV: {
    height: 2,
    width: '100%',
  },

  badge: {
    position: 'absolute',
    backgroundColor: C.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 200,
  },
  badgeH: {
    // Horizontal handle — badge appears to the right
    left: 10,
    top: '50%' as any,
    transform: [{ translateY: -10 }],
  },
  badgeV: {
    // Vertical handle — badge appears below
    top: 10,
    left: '50%' as any,
    transform: [{ translateX: -10 }],
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600' as any,
  },
});
