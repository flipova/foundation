/**
 * ParallaxLayout
 *
 * Horizontally scrollable rows with parallax synchronization.
 * Rows scroll together with optional alternating direction.
 */

import React from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue
} from "react-native-reanimated";
import { spacing as spacingTokens } from "../../tokens/spacing";
import { applyDefaults, getLayoutMeta } from "../registry";
import Box from "./primitives/Box";
import Scroll from "./primitives/Scroll";

const META = getLayoutMeta("ParallaxLayout")!;

type SpacingKey = keyof typeof spacingTokens;

export interface ParallaxLayoutProps {
  rows: React.ReactNode[][];
  spacing?: SpacingKey;
  alternateDirection?: boolean;
}

const ParallaxLayout: React.FC<ParallaxLayoutProps> = (rawProps) => {
  const { rows, spacing, alternateDirection } = applyDefaults(rawProps, META) as Required<ParallaxLayoutProps>;

  const scrollX = useSharedValue(0);
  const masterRowIndex = useSharedValue<number | -1>(-1);

  const contentWidths = useSharedValue<number[]>(new Array(rows.length).fill(0));
  const containerWidths = useSharedValue<number[]>(new Array(rows.length).fill(0));

  const gap = spacingTokens[spacing as SpacingKey] ?? 0;

  return (
    <Scroll>
      <Box py={spacing}>
        {rows.map((items, index) => (
          <ParallaxRow
            key={`row-${index}`}
            items={items}
            index={index}
            sharedScrollX={scrollX}
            masterRowIndex={masterRowIndex}
            contentWidths={contentWidths}
            containerWidths={containerWidths}
            gap={gap}
            alternateDirection={alternateDirection}
            isLastRow={index === rows.length - 1}
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
  masterRowIndex: SharedValue<number | -1>;
  contentWidths: SharedValue<number[]>;
  containerWidths: SharedValue<number[]>;
  gap: number;
  alternateDirection: boolean;
  isLastRow: boolean;
}

const ParallaxRow = ({
  items, index, sharedScrollX, masterRowIndex,
  contentWidths, containerWidths, gap, alternateDirection, isLastRow
}: ParallaxRowProps) => {
  const aref = useAnimatedRef<Animated.ScrollView>();
  const isInverse = alternateDirection && index % 2 !== 0;

  const initialScrollDone = useSharedValue(false);

  const handleContentSizeChange = (w: number) => {
    contentWidths.modify((widthArray) => {
      'worklet';
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
      'worklet';
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

        sharedScrollX.value = isInverse
          ? maxScroll - rawX
          : rawX;
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

    const masterMax = Math.max(1, contentWidths.value[masterIdx] - containerWidths.value[masterIdx]);
    const thisMax = Math.max(1, contentWidths.value[index] - containerWidths.value[index]);

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
      }}
      onLayout={handleLayout}
    >
      <Animated.ScrollView
        ref={aref}
        horizontal
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: gap }}
        onContentSizeChange={handleContentSizeChange}
        bounces={false}
      >
        {items.map((item: React.ReactNode, i: number) => (
          <Box key={`item-${i}`} style={{ marginRight: gap }}>
            {item}
          </Box>
        ))}
      </Animated.ScrollView>
    </Box>
  );
};

export default ParallaxLayout;
