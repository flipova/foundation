/**
 * Local replacement for the (unpublished) `@gluestack-ui/core/tabs/creator`
 * module. Implements the minimal state machine the `Tabs` components in
 * `./index.tsx` rely on: selection, orientation, scroll-offset tracking, and
 * layout measurement for the animated indicator.
 */
import React from 'react';

export interface LayoutData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TabsContextValue {
  orientation: 'horizontal' | 'vertical';
  selectedKey: string | undefined;
  setSelectedKey: (key: string) => void;
  scrollOffset: number;
  setScrollOffset: (x: number) => void;
  listRef: React.RefObject<any>;
  triggerLayouts: Map<string, LayoutData>;
  contentLayouts: Map<string, LayoutData>;
  registerTriggerLayout: (key: string, layout: LayoutData) => void;
  registerContentLayout: (key: string, layout: LayoutData) => void;
  // Attached ad-hoc by TabsList so the indicator can read a Reanimated
  // SharedValue for the scroll offset instead of the plain number above.
  animatedScrollOffset?: import('react-native-reanimated').SharedValue<number>;
}

export const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface CreateTabsConfig {
  Root: React.ComponentType<any>;
  List: React.ComponentType<any>;
  Trigger: React.ComponentType<any>;
  Content: React.ComponentType<any>;
  ContentWrapper: React.ComponentType<any>;
  TriggerText: React.ComponentType<any>;
  TriggerIcon: React.ComponentType<any>;
  Indicator: React.ComponentType<any>;
}

export function createTabs({
  Root,
  List,
  Trigger,
  Content,
  ContentWrapper,
  TriggerText,
  TriggerIcon,
  Indicator,
}: CreateTabsConfig) {
  const Tabs = React.forwardRef<any, any>(function Tabs(
    { value, defaultValue, onValueChange, orientation = 'horizontal', children, ...props },
    ref
  ) {
    const [uncontrolledKey, setUncontrolledKey] = React.useState<string | undefined>(defaultValue);
    const selectedKey = value !== undefined ? value : uncontrolledKey;
    const [scrollOffset, setScrollOffsetState] = React.useState(0);
    const listRef = React.useRef(null);
    const triggerLayouts = React.useRef(new Map<string, LayoutData>()).current;
    const contentLayouts = React.useRef(new Map<string, LayoutData>()).current;
    const [, forceRender] = React.useReducer((c) => c + 1, 0);

    const setSelectedKey = React.useCallback(
      (key: string) => {
        if (value === undefined) setUncontrolledKey(key);
        onValueChange?.(key);
      },
      [value, onValueChange]
    );

    const registerTriggerLayout = React.useCallback((key: string, layout: LayoutData) => {
      triggerLayouts.set(key, layout);
      forceRender();
    }, [triggerLayouts]);

    const registerContentLayout = React.useCallback((key: string, layout: LayoutData) => {
      contentLayouts.set(key, layout);
      forceRender();
    }, [contentLayouts]);

    const contextValue = React.useMemo<TabsContextValue>(
      () => ({
        orientation,
        selectedKey,
        setSelectedKey,
        scrollOffset,
        setScrollOffset: setScrollOffsetState,
        listRef,
        triggerLayouts,
        contentLayouts,
        registerTriggerLayout,
        registerContentLayout,
      }),
      [orientation, selectedKey, setSelectedKey, scrollOffset, triggerLayouts, contentLayouts, registerTriggerLayout, registerContentLayout]
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <Root ref={ref} {...props}>
          {children}
        </Root>
      </TabsContext.Provider>
    );
  });

  const TabsListBase = React.forwardRef<any, any>(function TabsListBase({ children, ...props }, ref) {
    return (
      <List ref={ref} {...props}>
        {children}
      </List>
    );
  });

  const TabsTriggerBase = React.forwardRef<any, any>(function TabsTriggerBase(
    { value, disabled, onPress, onLayout, ...props },
    ref
  ) {
    const context = React.useContext(TabsContext);
    const isSelected = context?.selectedKey === value;

    const handleLayout = React.useCallback(
      (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        context?.registerTriggerLayout(value, { x, y, width, height });
        onLayout?.(event);
      },
      [context, value, onLayout]
    );

    const handlePress = React.useCallback(
      (event: any) => {
        if (!disabled) context?.setSelectedKey(value);
        onPress?.(event);
      },
      [context, disabled, value, onPress]
    );

    return (
      <Trigger
        ref={ref}
        onPress={handlePress}
        onLayout={handleLayout}
        disabled={disabled}
        dataSet={{ selected: isSelected ? 'true' : 'false', disabled: disabled ? 'true' : 'false' }}
        {...props}
      />
    );
  });

  const TabsContentBase = React.forwardRef<any, any>(function TabsContentBase(
    { value, style, onLayout, ...props },
    ref
  ) {
    const context = React.useContext(TabsContext);
    const isSelected = context?.selectedKey === value;

    const handleLayout = React.useCallback(
      (event: any) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        context?.registerContentLayout(value, { x, y, width, height });
        onLayout?.(event);
      },
      [context, value, onLayout]
    );

    return (
      <Content
        ref={ref}
        onLayout={handleLayout}
        style={[style, !isSelected && { display: 'none' }]}
        {...props}
      />
    );
  });

  const TabsContentWrapperBase = React.forwardRef<any, any>(function TabsContentWrapperBase(props, ref) {
    return <ContentWrapper ref={ref} {...props} />;
  });

  const TabsIndicatorBase = React.forwardRef<any, any>(function TabsIndicatorBase(props, ref) {
    return <Indicator ref={ref} {...props} />;
  });

  const Compound = Tabs as typeof Tabs & {
    List: typeof TabsListBase;
    Trigger: typeof TabsTriggerBase;
    Content: typeof TabsContentBase;
    ContentWrapper: typeof TabsContentWrapperBase;
    TriggerText: typeof TriggerText;
    TriggerIcon: typeof TriggerIcon;
    Indicator: typeof TabsIndicatorBase;
  };
  Compound.List = TabsListBase;
  Compound.Trigger = TabsTriggerBase;
  Compound.Content = TabsContentBase;
  Compound.ContentWrapper = TabsContentWrapperBase;
  Compound.TriggerText = TriggerText;
  Compound.TriggerIcon = TriggerIcon;
  Compound.Indicator = TabsIndicatorBase;

  return Compound;
}
