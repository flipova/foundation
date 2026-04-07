/**
 * ParallaxLayout
 *
 * Horizontally scrollable rows with parallax synchronization.
 * Items are distributed into `rowCount` rows automatically.
 * All rows scroll in sync — odd rows scroll in reverse when alternateDirection is true.
 * Item cells adapt to their content height (no fixed height).
 */

import React, { useMemo } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { spacing as spacingTokens } from "../../tokens/spacing";
import { useTheme } from "../../theme/providers/ThemeProvider";
import { RadiusToken } from "../../tokens/radii";
import { applyDefaults, getLayoutMeta } from "../registry";
import { useStudioItems } from "../hooks/useStudioItems";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("ParallaxLayout")!;

type SpacingKey = keyof typeof spacingTokens;

export interface ParallaxLayoutProps {
  /** Flat list of items — distributed into rowCount rows automatically */
  items?: React.ReactNode[];
  children?: React.ReactNode | React.ReactNode[]; // backward compat
  /** Number of rows to distribute items into (default: 3) */
  rowCount?: number;
  /** Width of each item cell in px (default: 200) */
  itemWidth?: number;
  /** Vertical spacing between rows */
  spacing?: SpacingKey;
  /** Horizontal gap between items within a row (default: 12) */
  itemSpacing?: number;
  /** Alternate scroll direction on odd rows */
  alternateDirection?: boolean;
  /** Container background */
  background?: string;
  /** Background color for each row strip */
  rowBackground?: string;
  /** Background color for each item cell */
  itemBackground?: string;
  /** Border radius for each item cell */
  itemBorderRadius?: RadiusToken;
  /** Border radius for each row strip */
  rowBorderRadius?: RadiusToken;
  /** Enable scroll bounce (default: false) */
  bounces?: boolean;
  /** Show horizontal scroll indicator (default: false) */
  showScrollIndicator?: boolean;
  /** Scroll event throttle in ms (default: 16) */
  scrollEventThrottle?: number;
}

const ParallaxLayout: React.FC<ParallaxLayoutProps> = (rawProps) => {
  const { theme } = useTheme();
  const {
    items: itemsProp,
    children: childrenProp,
    rowCount,
    itemWidth,
    spacing,
    itemSpacing,
    alternateDirection,
    background,
    rowBackground,
    itemBackground,
    itemBorderRadius,
    rowBorderRadius,
    bounces,
    showScrollIndicator,
    scrollEventThrottle,
  } = applyDefaults(rawProps, META, theme) as Required<ParallaxLayoutProps>;

  // Standard: items > children (backward compat)
  const rawItems = Array.isArray(itemsProp) && itemsProp.length > 0
    ? itemsProp
    : React.Children.toArray(childrenProp as React.ReactNode).filter(Boolean);

  // Distribute flat items into rowCount rows (column-major: fill row 0, then row 1, ...)
  const safeItems = useStudioItems(
    rawItems,
    rowCount * 3,
    (i) => <Box key={i} width={itemWidth} height={80} bg={itemBackground} borderRadius={itemBorderRadius} opacity={0.4} />
  );

  const rows = useMemo<React.ReactNode[][]>(() => {
    const numRows = Math.max(1, rowCount);
    const result: React.ReactNode[][] = Array.from({ length: numRows }, () => []);
    safeItems.forEach((item, i) => {
      result[i % numRows].push(item);
    });
    return result;
  }, [safeItems, rowCount]);

  const scrollX = useSharedValue(0);
  const masterRowIndex = useSharedValue<number>(-1);
  const contentWidths = useSharedValue<number[]>(new Array(rows.length).fill(0));
  const containerWidths = useSharedValue<number[]>(new Array(rows.length).fill(0));

  const gap = spacingTokens[spacing as SpacingKey] ?? 0;

  return (
    <Scroll>
      <Box py={spacing} bg={background}>
        {rows.map((rowItems, index) => (
          <ParallaxRow
            key={`row-${index}`}
            items={rowItems}
            index={index}
            sharedScrollX={scrollX}
            masterRowIndex={masterRowIndex}
            contentWidths={contentWidths}
            containerWidths={containerWidths}
            gap={gap}
            itemSpacing={itemSpacing}
            itemWidth={itemWidth}
            alternateDirection={alternateDirection}
            isLastRow={index === rows.length - 1}
            rowBackground={rowBackground}
            rowBorderRadius={rowBorderRadius}
            itemBackground={itemBackground}
            itemBorderRadius={itemBorderRadius}
            bounces={bounces}
            showScrollIndicator={showScrollIndicator}
            scrollEventThrottle={scrollEventThrottle}
          />
        ))}
      </Box>
    </Scroll>
  );
};

interface ParallaxRowProps {
  items: React.ReactNode[];
  index: number;
  sharedScrollX: SharedValue<number>;
  masterRowIndex: SharedValue<number>;
  contentWidths: SharedValue<number[]>;
  containerWidths: SharedValue<number[]>;
  gap: number;
  itemSpacing: number;
  itemWidth: number;
  alternateDirection: boolean;
  isLastRow: boolean;
  rowBackground?: string;
  rowBorderRadius?: RadiusToken;
  itemBackground?: string;
  itemBorderRadius?: RadiusToken;
  bounces: boolean;
  showScrollIndicator: boolean;
  scrollEventThrottle: number;
}

const ParallaxRow = ({
  items,
  index,
  sharedScrollX,
  masterRowIndex,
  contentWidths,
  containerWidths,
  gap,
  itemSpacing,
  itemWidth,
  alternateDirection,
  isLastRow,
  rowBackground,
  rowBorderRadius,
  itemBackground,
  itemBorderRadius,
  bounces,
  showScrollIndicator,
  scrollEventThrottle,
}: ParallaxRowProps) => {
  const aref = useAnimatedRef<Animated.ScrollView>();
  const isInverse = alternateDirection && index % 2 !== 0;
  const initialScrollDone = useSharedValue(false);

  const handleContentSizeChange = (w: number) => {
    contentWidths.modify((widthArray) => {
      "worklet";
      widthArray[index] = w;
      return widthArray;
    });

    if (isInverse) {
      const containerW = containerWidths.value[index];
      const maxScroll = Math.max(0, w - containerW);
      if (maxScroll > 0 && !initialScrollDone.value) {
        initialScrollDone.value = true;
        scrollTo(aref, maxScroll, 0, false);
        if (masterRowIndex.value === -1) {
          sharedScrollX.value = maxScroll;
        }
      }
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    containerWidths.modify((widthArray) => {
      "worklet";
      widthArray[index] = width;
      return widthArray;
    });
  };

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      masterRowIndex.value = index;
    },
    onScroll: (event) => {
      if (masterRowIndex.value === index) {
        const contentW = contentWidths.value[index];
        const containerW = containerWidths.value[index];
        const maxScroll = Math.max(1, contentW - containerW);
        const rawX = event.contentOffset.x;
        sharedScrollX.value = isInverse ? maxScroll - rawX : rawX;
      }
    },
    onEndDrag: (e) => {
      if (Math.abs(e.velocity?.x ?? 0) < 0.1) {
        masterRowIndex.value = -1;
      }
    },
    onMomentumEnd: () => {
      masterRowIndex.value = -1;
    },
  });

  useDerivedValue(() => {
    const masterIdx = masterRowIndex.value;
    if (masterIdx === -1 || masterIdx === index) return;

    const masterMax = Math.max(
      1,
      contentWidths.value[masterIdx] - containerWidths.value[masterIdx]
    );
    const thisMax = Math.max(
      1,
      contentWidths.value[index] - containerWidths.value[index]
    );
    const masterProgress = sharedScrollX.value / masterMax;
    const targetX = isInverse
      ? thisMax * (1 - masterProgress)
      : thisMax * masterProgress;

    scrollTo(aref, Math.max(0, Math.min(thisMax, targetX)), 0, false);
  });

  return (
    <Box
      style={{
        paddingVertical: gap / 2,
        paddingBottom: isLastRow ? 0 : gap / 2,
        backgroundColor: rowBackground,
        borderRadius: rowBorderRadius as any,
        overflow: "hidden",
      }}
      onLayout={handleLayout}
    >
      <Animated.ScrollView
        ref={aref}
        horizontal
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsHorizontalScrollIndicator={showScrollIndicator}
        contentContainerStyle={{ paddingHorizontal: itemSpacing }}
        onContentSizeChange={handleContentSizeChange}
        bounces={bounces}
      >
        {items.map((item: React.ReactNode, i: number) => (
          <Box
            key={`item-${i}`}
            style={{
              width: itemWidth,
              marginRight: itemSpacing,
              backgroundColor: itemBackground || "transparent",
              borderRadius: itemBorderRadius as any,
              overflow: "hidden",
            }}
          >
            {item}
          </Box>
        ))}
      </Animated.ScrollView>
    </Box>
  );
};

export default ParallaxLayout;
