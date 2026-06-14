/**
 * DeviceCanvas — Center panel with device frame, navigation chrome, and live preview.
 * Renders tabbar/drawer/stack based on project navigation config.
 * Simulates iOS/Android status bar with real icons.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

import { useStudio } from '../../useStudio';
import { THEME_REGISTRY } from '@flipova/studio-core';
import { ThemeProvider } from '@flipova/foundation/theme';
import PlatformSimulator from '../../renderer/PlatformSimulator';
import NodeRenderer, { PageQueryProvider } from '../../renderer/NodeRenderer';
import Tooltip from '../../shared/Tooltip';
import { CANVAS_TEXTS } from './canvasTexts';
import { CANVAS_RESPONSIVE } from './canvasResponsive';
import { PreviewOverlayProvider } from '../../renderer/PreviewOverlayContext';
import { resolveExprForPreview } from '../../renderer/useNodeResolution';

export { CANVAS_TEXTS };
export { CANVAS_RESPONSIVE };

import { colors as C } from '../../ds';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Calculate initial zoom so the device fits in the available canvas width
  useEffect(() => {
    if (canvasWidth > 0 && typeof setZoom === 'function') {
      const initialZoom = CANVAS_RESPONSIVE.calculateInitialZoom(canvasWidth, w);
      setZoom(initialZoom);
    }
  }, [canvasWidth, setZoom, w]);

  const currentThemeId = project?.theme || 'light';
  const customThemes = buildCustomThemes(project);
  const themeColors = customThemes?.[currentThemeId] || THEME_REGISTRY[currentThemeId] || THEME_REGISTRY['light'];

  const resolveConfigValue = (val: string | undefined, fallback: any) => {
    if (!val) return fallback;
    const resolved = resolveExprForPreview(val, { themeColors });
    if (typeof resolved === 'string' && resolved.startsWith('$')) return fallback;
    return resolved !== undefined ? resolved : fallback;
  };

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
  const currentScreenConfig = screens.find((s: any) => s.pageId === pageId);
  const showStackHeader = !isInTabsGroup && !isInDrawerGroup && currentScreenConfig?.options?.headerShown !== false;

  // Tab bar: only screens in the same tabs group
  const tabBarScreens = isInTabsGroup && currentGroup
    ? (currentGroup.screenIds || []).map((sid: string) => {
        const sc2 = screens.find((s: any) => s.pageId === sid);
        const linked = project?.pages?.find((p: any) => p.id === sid);
        return sc2 ? sc2 : { pageId: sid, name: linked?.name || 'Screen', icon: 'circle' };
      })
    : [];

  const navRef = React.useRef<any>(null);
  React.useEffect(() => {
    if (navRef.current?.isReady()) {
      const currentRoute = navRef.current.getCurrentRoute();
      if (currentRoute?.name !== pageId) {
        navRef.current.navigate(pageId);
      }
    }
  }, [pageId]);

  const handleLayout = (e: LayoutChangeEvent) => {
    setCanvasWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }} onLayout={handleLayout}>
      {/* pageTabs: horizontal scroll, no wrap — Requirement 14.3 */}
      <View style={[s.pageTabs, { borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.surface }]}>
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
      <ScrollView style={s.viewport} contentContainerStyle={s.viewportInner} scrollEnabled={true} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        {previewMode && (
          <View style={s.previewBadge} pointerEvents="none">
            <Text style={s.previewBadgeText}>{CANVAS_TEXTS.previewBadge}</Text>
          </View>
        )}
        <View style={[s.deviceOuter, { width: w * scale, height: h * scale }]}>
          <View style={[s.device, { width: w, height: h, transform: [{ scale }] }]}>
            {!(project as any)?.statusBar?.hidden && <StatusBarChrome isAndroid={isAndroid} statusBarConfig={(project as any)?.statusBar} resolveConfigValue={resolveConfigValue} themeMode={project?.theme || 'light'} />}
            <View style={s.screen}>
              <NavigationContainer independent={true} ref={navRef}>
                {isInTabsGroup && tabBarScreens.length > 0 ? (
                  <BottomTab.Navigator
                    screenOptions={{
                      headerShown: showStackHeader,
                      tabBarStyle: { 
                        backgroundColor: resolveConfigValue((project as any)?.tabBarConfig?.backgroundColor, '#ffffff'), 
                        borderTopWidth: 0.5, 
                        borderTopColor: resolveConfigValue((project as any)?.tabBarConfig?.borderTopColor, '#e5e5ea'), 
                        height: (project as any)?.tabBarConfig?.height ? parseInt(resolveConfigValue((project as any).tabBarConfig.height, isAndroid ? 56 : 49)) : (isAndroid ? 56 : 49)
                      },
                      tabBarActiveTintColor: resolveConfigValue((project as any)?.tabBarConfig?.activeTintColor, '#007AFF'),
                      tabBarInactiveTintColor: resolveConfigValue((project as any)?.tabBarConfig?.inactiveTintColor, '#8E8E93'),
                      tabBarShowLabel: (project as any)?.tabBarConfig?.showLabels !== false,
                    }}
                  >
                    {tabBarScreens.map((sc: any) => (
                      <BottomTab.Screen
                        key={sc.pageId}
                        name={sc.pageId}
                        options={{
                          headerShown: sc.options?.headerShown !== false,
                          tabBarLabel: sc.name || 'Screen',
                          tabBarIcon: ({ color, size }) => <Feather name={(sc.icon as any) || 'circle'} size={size} color={color} />,
                        }}
                        listeners={{ tabPress: () => { setPageId(sc.pageId); } }}
                      >
                        {() => sc.pageId === pageId ? (
                          <PlatformSimulator device={device} width={w} height={h}>
                            <ThemeProvider key={project?.theme} defaultTheme={project?.theme || 'light'} customThemes={buildCustomThemes(project)}>
                              <PreviewOverlayProvider>
                                {pg?.root ? <PageQueryProvider node={pg.root} /> : <Text style={s.emptyText}>{CANVAS_TEXTS.emptyState}</Text>}
                              </PreviewOverlayProvider>
                            </ThemeProvider>
                          </PlatformSimulator>
                        ) : <View />}
                      </BottomTab.Screen>
                    ))}
                  </BottomTab.Navigator>
                ) : isInDrawerGroup ? (
                  <Drawer.Navigator
                    screenOptions={({ navigation }) => ({
                      headerShown: true,
                      drawerType: resolveConfigValue((project as any)?.drawerConfig?.drawerType, 'front'),
                      drawerStyle: { 
                        backgroundColor: resolveConfigValue((project as any)?.drawerConfig?.backgroundColor, '#ffffff'),
                        width: (project as any)?.drawerConfig?.drawerWidth ? parseInt(resolveConfigValue((project as any).drawerConfig.drawerWidth, 280)) : 280
                      },
                      drawerActiveTintColor: resolveConfigValue((project as any)?.drawerConfig?.activeTintColor, '#007AFF'),
                      drawerInactiveTintColor: resolveConfigValue((project as any)?.drawerConfig?.inactiveTintColor, '#8E8E93'),
                      headerLeft: () => (
                        <Pressable onPress={() => navigation.toggleDrawer()} style={{ padding: 12 }}>
                          <Feather name="menu" size={22} color={isAndroid ? '#000' : '#007AFF'} />
                        </Pressable>
                      ),
                    })}
                  >
                    {(currentGroup?.screenIds as string[] || []).map(sid => {
                      const sc2 = screens.find((s: any) => s.pageId === sid);
                      const linked = project?.pages?.find((p: any) => p.id === sid);
                      return sc2 ? sc2 : { pageId: sid, name: linked?.name || 'Screen', icon: 'circle' };
                    }).map((sc: any) => (
                      <Drawer.Screen
                        key={sc.pageId}
                        name={sc.pageId}
                        options={{
                          headerShown: sc.options?.headerShown !== false,
                          drawerLabel: sc.name || 'Screen',
                          title: sc.name || 'Screen',
                          drawerIcon: ({ color, size }) => <Feather name={(sc.icon as any) || 'circle'} size={size} color={color} />,
                        }}
                        listeners={{ drawerItemPress: () => { setPageId(sc.pageId); } }}
                      >
                        {() => sc.pageId === pageId ? (
                          <PlatformSimulator device={device} width={w} height={h}>
                            <ThemeProvider key={project?.theme} defaultTheme={project?.theme || 'light'} customThemes={buildCustomThemes(project)}>
                              <PreviewOverlayProvider>
                                {pg?.root ? <PageQueryProvider node={pg.root} /> : <Text style={s.emptyText}>{CANVAS_TEXTS.emptyState}</Text>}
                              </PreviewOverlayProvider>
                            </ThemeProvider>
                          </PlatformSimulator>
                        ) : <View />}
                      </Drawer.Screen>
                    ))}
                  </Drawer.Navigator>
                ) : (
                  <>
                    {showStackHeader && <StackHeader title={activePageName} isAndroid={isAndroid} />}
                    <PlatformSimulator device={device} width={w} height={h}>
                      <ThemeProvider key={project?.theme} defaultTheme={project?.theme || 'light'} customThemes={buildCustomThemes(project)}>
                        <PreviewOverlayProvider>
                          {pg?.root ? <PageQueryProvider node={pg.root} /> : <Text style={s.emptyText}>{CANVAS_TEXTS.emptyState}</Text>}
                        </PreviewOverlayProvider>
                      </ThemeProvider>
                    </PlatformSimulator>
                  </>
                )}
              </NavigationContainer>
            </View>
            {isPhone && <View style={s.homeBar}><View style={s.homeIndicator} /></View>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Utility to calculate contrast color
function getContrastYIQ(color: string, fallback: string = '#000') {
  if (!color || color === 'transparent') return fallback;
  let r=0, g=0, b=0;
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) return fallback;
    r = parseInt(match[0]); g = parseInt(match[1]); b = parseInt(match[2]);
  } else {
    let hex = color.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    if (hex.length !== 6 && hex.length !== 8) return fallback;
    r = parseInt(hex.substring(0,2),16);
    g = parseInt(hex.substring(2,4),16);
    b = parseInt(hex.substring(4,6),16);
  }
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? '#000' : '#fff';
}

const StatusBarChrome: React.FC<{ isAndroid: boolean; statusBarConfig?: any; resolveConfigValue?: (v: string | undefined, fb: string) => string; themeMode?: string }> = ({ isAndroid, statusBarConfig, resolveConfigValue, themeMode = 'light' }) => {
  const rawBg = statusBarConfig?.backgroundColor || (statusBarConfig?.translucent ? 'transparent' : undefined);
  const bgColor = resolveConfigValue && rawBg ? resolveConfigValue(rawBg, 'transparent') : rawBg;
  const isHidden = statusBarConfig?.hidden;
  
  let textColor = '#000';
  if (statusBarConfig?.style === 'light') textColor = '#fff';
  else if (statusBarConfig?.style === 'dark') textColor = '#000';
  else if (rawBg && rawBg.startsWith('#')) {
    const c = rawBg.replace('#', '');
    if (c.length === 3 || c.length === 6) {
      const fullC = c.length === 3 ? c.split('').map((x: string) => x + x).join('') : c;
      const r = parseInt(fullC.substr(0, 2), 16);
      const g = parseInt(fullC.substr(2, 2), 16);
      const b = parseInt(fullC.substr(4, 2), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      textColor = luminance > 0.5 ? '#000' : '#fff';
    }
  }
  else {
    // 'auto': adapt to background color if provided, else adapt to theme
    if (bgColor && bgColor !== 'transparent') {
      textColor = getContrastYIQ(bgColor, themeMode === 'dark' ? '#fff' : '#000');
    } else {
      textColor = themeMode === 'dark' ? '#fff' : '#000';
    }
  }

  
  const [time, setTime] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const int = setInterval(updateTime, 10000); // every 10s
    return () => clearInterval(int);
  }, []);

  if (isHidden) return null;

  return (
    <View style={[
      s.statusBar, 
      isAndroid && s.statusBarAndroid, 
      bgColor ? { backgroundColor: bgColor } : undefined,
      statusBarConfig?.translucent && { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }
    ]}>
      <Text style={[s.statusTime, { color: textColor }]}>{time || (isAndroid ? '12:00' : '9:41')}</Text>
      <View style={s.statusRight}>
        <Feather name="wifi" size={14} color={textColor} />
        <Feather name={isAndroid ? 'bar-chart' : 'bar-chart-2'} size={14} color={textColor} style={{ transform: [{ rotate: '90deg' }] }} />
        <View style={[s.battery, { borderColor: textColor }]}>
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

const DrawerHeader: React.FC<{ title: string; isAndroid: boolean; onOpenDrawer: () => void }> = ({ title, isAndroid, onOpenDrawer }) => (
  <View style={[s.stackHeader, isAndroid && s.stackHeaderAndroid]}>
    <Pressable onPress={onOpenDrawer} style={{ padding: 4, marginLeft: -4 }}>
      <Feather name="menu" size={22} color={isAndroid ? '#000' : '#007AFF'} />
    </Pressable>
    <Text style={[s.stackTitle, isAndroid && s.stackTitleAndroid]}>{title}</Text>
    <View style={{ width: 22 }} />
  </View>
);

const DrawerOverlay: React.FC<{ isOpen: boolean; onClose: () => void; screens: any[]; activePageId: string | null; onSelect: (id: string) => void; drawerConfig: any }> = ({ isOpen, onClose, screens, activePageId, onSelect, drawerConfig }) => {
  if (!isOpen) return null;
  const bgColor = drawerConfig?.backgroundColor || '#ffffff';
  const activeTint = drawerConfig?.activeTintColor || '#007AFF';
  const inactiveTint = drawerConfig?.inactiveTintColor || '#8E8E93';

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}>
      <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.5)' }]} onPress={onClose} />
      <View style={{ width: '75%', height: '100%', backgroundColor: bgColor, paddingTop: 60 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal: 20, marginBottom: 20, color: inactiveTint }}>Menu</Text>
        {screens.map((sc) => {
          const active = sc.pageId === activePageId;
          return (
            <Pressable key={sc.pageId} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: active ? activeTint + '15' : 'transparent' }} onPress={() => { onSelect(sc.pageId); onClose(); }}>
              <Feather name={sc.icon || 'circle'} size={20} color={active ? activeTint : inactiveTint} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, fontWeight: active ? '600' as any : '400' as any, color: active ? activeTint : inactiveTint }}>{sc.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default DeviceCanvas;

const s = StyleSheet.create({
  pageTabs: { height: 32 },
  pageTabsInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, gap: 1 },
  pageTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 3 },
  pageTabOn: { backgroundColor: C.primary + '22', borderBottomWidth: 1, borderBottomColor: C.primary },
  pageTabText: { color: C.muted, fontSize: 10, fontWeight: '400', fontFamily: 'Lexend' as any },
  pageTabTextOn: { color: C.text, fontWeight: '500', fontFamily: 'Lexend' as any },
  viewport: { flex: 1 },
  viewportInner: { alignItems: 'center', paddingVertical: 32, minHeight: '100%' },
  deviceOuter: { overflow: 'visible', boxShadow: '0px 20px 40px rgba(0,0,0,0.5)' as any, elevation: 20 },
  device: { backgroundColor: '#fff', borderRadius: 44, overflow: 'hidden', borderWidth: 1, borderColor: '#1e1e1e', transformOrigin: 'top left' },
  statusBar: { height: 54, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 32, paddingBottom: 12 },
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
  emptyText: { color: C.muted, textAlign: 'center', marginTop: 40, fontSize: 12, fontFamily: 'Lexend' as any },
  previewBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: C.primary, borderRadius: 3, paddingHorizontal: 7, paddingVertical: 2, zIndex: 10 },
  previewBadgeText: { color: '#fff', fontSize: 9, fontWeight: '700', fontFamily: 'Lexend' as any, letterSpacing: 0.8 },
  tabBar: { height: 49, flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#c6c6c8', backgroundColor: '#f8f8f8' },
  tabBarAndroid: { height: 56, borderTopWidth: 0, backgroundColor: '#fff', elevation: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  tabLabel: { fontSize: 10, color: '#8E8E93', marginTop: 2 },
  tabIndicator: { position: 'absolute', bottom: 0, width: 32, height: 3, backgroundColor: '#007AFF', borderRadius: 2 },
  homeBar: { height: 20, alignItems: 'center', justifyContent: 'center' },
  homeIndicator: { width: 134, height: 5, backgroundColor: '#000', borderRadius: 3, opacity: 0.2 },
});

