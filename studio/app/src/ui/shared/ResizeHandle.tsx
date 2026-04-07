/**
 * ResizeHandle — Draggable divider for resizable panels.
 * Web-only (uses mouse events). On native, renders nothing.
 *
 * Requirements: 16.7 — shows a size badge during drag
 */
import React, { useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

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
    <View ref={handleRef} style={[s.handle, vertical && s.handleV]}>
      <View style={s.grip}>
        {[0, 1, 2].map(i => <View key={i} style={[s.gripDot, vertical && s.gripDotH]} />)}
      </View>
      {showBadge && (
        <View style={[s.badge, vertical ? s.badgeV : s.badgeH]}>
          <Text style={s.badgeText}>
            {vertical ? `${Math.round(liveSize!)}px` : `${Math.round(liveSize!)}px`}
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
  handleV: { width: '100%' as any, height: 6, flexDirection: 'row', cursor: 'row-resize' as any },
  grip: { gap: 3, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  gripDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(106,116,148,0.5)',
  },
  gripDotH: {
    width: 2,
    height: 2,
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
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
    transform: [{ translateX: -20 }],
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'monospace' as any,
  },
});
