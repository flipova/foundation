/**
 * DeviceCanvas — Center panel with device frame, navigation chrome, and live preview.
 * Renders tabbar/drawer/stack based on project navigation config.
 * Simulates iOS/Android status bar with real icons.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useStudio } from '../store/StudioProvider';
import { THEME_REGISTRY } from '../store/tokens';
import { ThemeProvider } from '../../../../foundation/theme/providers/ThemeProvider';
import { PlatformSimulator } from '../renderer/PlatformSimulator';
import NodeRenderer, { PageQueryProvider } from '../renderer/NodeRenderer';
import Tooltip from './shared/Tooltip';
import { CANVAS_TEXTS } from './canvasTexts';
import { CANVAS_RESPONSIVE } from './canvasResponsive';
import { PreviewOverlayProvider } from '../renderer/PreviewOverlayContext';

export { CANVAS_TEXTS };
export { CANVAS_RESPONSIVE };

const C = { bg: '#080c18', surface: '#0d1220', border: '#1a2240', text: '#d0d8f0', muted: '#6a7494', primary: '#3b82f6' };
const DIMS: Record<string, [number, number]> = {
  'iPhone 14 Pro': [390, 844], 'Pixel 7': [412, 915], 'iPhone SE': [375, 667],
  'iPad Air': [820, 1180], 'Desktop/Web': [1280, 800],
};

function buildCustomThemes(project: any): Record<string, any> | undefined {
  if (!project?.themeOverrides) return undefined;
  const hasAny = Object.values(project.themeOverrides).some((v: any) => v && Object.keys(v).length > 0);
  if (!hasAny) return undefined;
  const result: Record<string, any> = {};
  for (const [themeName, overrides] of Object.entries(project.themeOverrides)) {
    if (overrides && typeof overrides === 'object' && Object.keys(overrides as any).length > 0) {
      const base = THEME_REGISTRY[themeName];
      if (base) result[themeName] = { ...base, ...(overrides as any) };
    }
  }
  return result;
}

const DeviceCanvas: React.FC = () => {
  const { project, pageId, setPageId, page, zoom: storeZoom, setZoom, device, setSel, previewMode } = useStudio();
  const pg = page();
  const [w, h] = DIMS[device] || [390, 844];
  const [canvasWidth, setCanvasWidth] = useState(0);

  // Calculate initial zoom so the device fits in the available canvas width
  useEffect(() => {
    if (canvasWidth > 0 && typeof setZoom === 'function') {
      const initialZoom = CANVAS_RESPONSIVE.calculateInitialZoom(canvasWidth, w);
      setZoom(initialZoom);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth, w]);

  // If canvas width drops below 320px, reduce zoom automatically
  useEffect(() => {
    if (canvasWidth > 0 && CANVAS_RESPONSIVE.shouldReduceZoom(canvasWidth) && typeof setZoom === 'function') {
      const reducedZoom = CANVAS_RESPONSIVE.calculateInitialZoom(canvasWidth, w);
      setZoom(reducedZoom);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasWidth, w]);

  const zoom = storeZoom;
  const scale = zoom / 100;
  const isAndroid = device.includes('Pixel');
  const isPhone = !device.includes('iPad') && !device.includes('Desktop');
  const screens = project?.navigation?.screens || [];
  // Use page.name as the authoritative title — NavigationScreen.name can be stale
  const activePageName = pg?.name || 'Screen';

  // Derive nav chrome from the current page's group type
  const screenGroups: any[] = (project as any)?.screenGroups || [];
  const currentGroup = screenGroups.find((g: any) => (g.screenIds || []).includes(pageId || ''));
  // Default to first group type if page somehow has no group (migration safety)
  const currentGroupType: string = currentGroup?.type || screenGroups[0]?.type || 'stack';

  const isInTabsGroup = currentGroupType === 'tabs';
  const isInDrawerGroup = currentGroupType === 'drawer';
  const showStackHeader = !isInTabsGroup && !isInDrawerGroup;

  // Tab bar: only screens in the same tabs group
  const tabBarScreens = isInTabsGroup && currentGroup
    ? screens.filter((s: any) => (currentGroup.screenIds as string[]).includes(s.pageId))
    : [];

  const handleLayout = (e: LayoutChangeEvent) => {
    setCanvasWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={s.root} onLayout={handleLayout}>
      {/* pageTabs: horizontal scroll, no wrap — Requirement 14.3 */}
      <View style={s.pageTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pageTabsInner}>
          {project?.pages.map(p => (
            <Tooltip key={p.id} text={p.name}>
              <Pressable style={[s.pageTab, p.id === pageId && s.pageTabOn]} onPress={() => { setPageId(p.id); setSel(null); }}>
                <Text style={[s.pageTabText, p.id === pageId && s.pageTabTextOn]}>{p.name}</Text>
              </Pressable>
            </Tooltip>
          ))}
        </ScrollView>
      </View>
      {/* viewport: vertical scroll when device height exceeds available space — Requirement 14.2 */}
      <ScrollView style={s.viewport} contentContainerStyle={s.viewportInner} scrollEnabled={true}>
        {previewMode && (
          <View style={s.previewBadge} pointerEvents="none">
            <Text style={s.previewBadgeText}>{CANVAS_TEXTS.previewBadge}</Text>
          </View>
        )}
        <View style={[s.deviceOuter, { width: w * scale, height: h * scale }]}>
          <View style={[s.device, { width: w, height: h, transform: [{ scale }] }]}>
            {!(project as any)?.statusBar?.hidden && <StatusBarChrome isAndroid={isAndroid} statusBarConfig={(project as any)?.statusBar} />}
            {showStackHeader && <StackHeader title={activePageName} isAndroid={isAndroid} />}
            {isInDrawerGroup && <DrawerHeader title={activePageName} isAndroid={isAndroid} />}
            <View style={s.screen}>
              <PlatformSimulator device={device} width={w} height={h}>
                <ThemeProvider key={project?.theme} defaultTheme={project?.theme || 'light'} customThemes={buildCustomThemes(project)}>
                  <PreviewOverlayProvider>
                    {pg?.root ? <PageQueryProvider node={pg.root} /> : <Text style={s.emptyText}>{CANVAS_TEXTS.emptyState}</Text>}
                  </PreviewOverlayProvider>
                </ThemeProvider>
              </PlatformSimulator>
            </View>
            {isInTabsGroup && tabBarScreens.length > 0 && <TabBar screens={tabBarScreens} activePageId={pageId} onSelect={setPageId} isAndroid={isAndroid} tabBarConfig={(project as any)?.tabBarConfig} />}
            {isPhone && <View style={s.homeBar}><View style={s.homeIndicator} /></View>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const StatusBarChrome: React.FC<{ isAndroid: boolean; statusBarConfig?: any }> = ({ isAndroid, statusBarConfig }) => {
  const isDark = statusBarConfig?.style === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = statusBarConfig?.backgroundColor || (statusBarConfig?.translucent ? 'transparent' : undefined);
  return (
    <View style={[s.statusBar, isAndroid && s.statusBarAndroid, bgColor ? { backgroundColor: bgColor } : undefined]}>
      <Text style={[s.statusTime, { color: textColor }]}>{isAndroid ? '12:00' : '9:41'}</Text>
      <View style={s.statusRight}>
        <Feather name="wifi" size={12} color={textColor} />
        <Feather name={isAndroid ? 'bar-chart' : 'bar-chart-2'} size={12} color={textColor} style={{ transform: [{ rotate: '90deg' }] }} />
        <View style={s.battery}>
          <View style={[s.batteryFill, { backgroundColor: textColor }]} />
        </View>
      </View>
    </View>
  );
};

const StackHeader: React.FC<{ title: string; isAndroid: boolean }> = ({ title, isAndroid }) => (
  <View style={[s.stackHeader, isAndroid && s.stackHeaderAndroid]}>
    <Feather name="chevron-left" size={22} color={isAndroid ? '#000' : '#007AFF'} />
    <Text style={[s.stackTitle, isAndroid && s.stackTitleAndroid]}>{title}</Text>
    <View style={{ width: 22 }} />
  </View>
);

const TAB_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> = {
  Home: 'home', Settings: 'settings', Profile: 'user', Search: 'search',
  Messages: 'message-circle', Notifications: 'bell', Feed: 'rss', Map: 'map-pin',
};

const TabBar: React.FC<{ screens: any[]; activePageId: string | null; onSelect: (id: string) => void; isAndroid: boolean; tabBarConfig?: any }> = ({ screens, activePageId, onSelect, isAndroid, tabBarConfig }) => {
  const bgColor = tabBarConfig?.backgroundColor;
  const activeTint = tabBarConfig?.activeTintColor || '#007AFF';
  const inactiveTint = tabBarConfig?.inactiveTintColor || '#8E8E93';
  const showLabels = tabBarConfig?.showLabels !== false;
  // Feather fallback icons for tab bar preview
  const FALLBACK_ICONS: React.ComponentProps<typeof Feather>['name'][] = ['home', 'search', 'bell', 'user', 'settings'];
  const NAMED_ICONS: Record<string, React.ComponentProps<typeof Feather>['name']> = {
    Home: 'home', Settings: 'settings', Profile: 'user', Search: 'search',
    Messages: 'message-circle', Notifications: 'bell', Feed: 'rss', Map: 'map-pin',
  };
  return (
    <View style={[s.tabBar, isAndroid && s.tabBarAndroid, bgColor ? { backgroundColor: bgColor } : undefined]}>
      {screens.map((sc, i) => {
        const active = sc.pageId === activePageId;
        // sc.icon is a Feather name (from IconPickerField), fall back to named map then index
        const icon: React.ComponentProps<typeof Feather>['name'] =
          (sc.icon && FALLBACK_ICONS.includes(sc.icon as any) ? sc.icon : null) ||
          NAMED_ICONS[sc.name] ||
          FALLBACK_ICONS[i % FALLBACK_ICONS.length];
        return (
          <Pressable key={sc.pageId} style={s.tabItem} onPress={() => onSelect(sc.pageId)}>
            <Feather name={icon} size={isAndroid ? 22 : 24} color={active ? activeTint : inactiveTint} />
            {!isAndroid && showLabels && <Text style={[s.tabLabel, { color: active ? activeTint : inactiveTint }]}>{sc.name}</Text>}
            {isAndroid && active && <View style={[s.tabIndicator, { backgroundColor: activeTint }]} />}
          </Pressable>
        );
      })}
    </View>
  );
};

const DrawerHeader: React.FC<{ title: string; isAndroid: boolean }> = ({ title, isAndroid }) => (
  <View style={[s.stackHeader, isAndroid && s.stackHeaderAndroid]}>
    <Feather name="menu" size={22} color={isAndroid ? '#000' : '#007AFF'} />
    <Text style={[s.stackTitle, isAndroid && s.stackTitleAndroid]}>{title}</Text>
    <View style={{ width: 22 }} />
  </View>
);

export default DeviceCanvas;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  pageTabs: { height: 34, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface },
  pageTabsInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 2 },
  pageTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  pageTabOn: { backgroundColor: 'rgba(59,130,246,0.15)' },
  pageTabText: { color: C.muted, fontSize: 11, fontWeight: '500' },
  pageTabTextOn: { color: C.text },
  viewport: { flex: 1 },
  viewportInner: { alignItems: 'center', paddingVertical: 24, minHeight: '100%' },
  deviceOuter: { overflow: 'hidden' },
  device: { backgroundColor: '#fff', borderRadius: 44, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd', transformOrigin: 'top left' },
  statusBar: { height: 54, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 6 },
  statusBarAndroid: { height: 28, paddingBottom: 4, paddingHorizontal: 16 },
  statusTime: { fontSize: 15, fontWeight: '600', color: '#000' },
  statusRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  battery: { width: 22, height: 10, borderRadius: 2, borderWidth: 1, borderColor: '#000', justifyContent: 'center', paddingHorizontal: 1 },
  batteryFill: { flex: 1, height: 6, backgroundColor: '#000', borderRadius: 1 },
  stackHeader: { height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderBottomWidth: 0.5, borderBottomColor: '#c6c6c8' },
  stackHeaderAndroid: { height: 56, paddingHorizontal: 4, elevation: 4, backgroundColor: '#fff' },
  stackTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: '#000', marginRight: -22 },
  stackTitleAndroid: { textAlign: 'left', fontSize: 20, fontWeight: '400', marginLeft: 12, marginRight: 0 },
  screen: { flex: 1, overflow: 'hidden' },
  emptyText: { color: '#999', textAlign: 'center', marginTop: 40, fontSize: 13 },
  previewBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#3b82f6', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, zIndex: 10 },
  previewBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  tabBar: { height: 49, flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#c6c6c8', backgroundColor: '#f8f8f8' },
  tabBarAndroid: { height: 56, borderTopWidth: 0, backgroundColor: '#fff', elevation: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  tabLabel: { fontSize: 10, color: '#8E8E93', marginTop: 2 },
  tabIndicator: { position: 'absolute', bottom: 0, width: 32, height: 3, backgroundColor: '#007AFF', borderRadius: 2 },
  homeBar: { height: 20, alignItems: 'center', justifyContent: 'center' },
  homeIndicator: { width: 134, height: 5, backgroundColor: '#000', borderRadius: 3, opacity: 0.2 },
});
