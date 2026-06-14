import re
import os

path = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/panels/canvas/index.tsx'

with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

# Add imports
imports = """import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
"""
code = code.replace("import { Feather } from '@expo/vector-icons';", "import { Feather } from '@expo/vector-icons';\n" + imports)

# Find where to wrap the device inner view
# We will replace the entire device inner block.
# Wait, let's locate the device block.
device_block_start = "{!(project as any)?.statusBar?.hidden && <StatusBarChrome isAndroid={isAndroid} statusBarConfig={(project as any)?.statusBar} />}"
device_block_end = "{isInDrawerGroup && <DrawerOverlay isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} screens={screens.filter((s: any) => currentGroup?.screenIds.includes(s.pageId))} activePageId={pageId} onSelect={setPageId} drawerConfig={(project as any)?.drawerConfig} />}"

device_regex = re.compile(r"\{!\(project as any\)\?\.statusBar\?\.hidden.*?" + re.escape(device_block_end) + r"\}", re.DOTALL)

# Let's construct the new device block
new_device_block = """
            {!(project as any)?.statusBar?.hidden && <StatusBarChrome isAndroid={isAndroid} statusBarConfig={(project as any)?.statusBar} />}
            <View style={s.screen}>
              <NavigationContainer independent={true}>
                {isInTabsGroup && tabBarScreens.length > 0 ? (
                  <BottomTab.Navigator
                    screenOptions={{
                      headerShown: showStackHeader,
                      tabBarStyle: { backgroundColor: (project as any)?.tabBarConfig?.backgroundColor || '#f8f8f8', borderTopWidth: 0.5, borderTopColor: '#c6c6c8', height: isAndroid ? 56 : 49 },
                      tabBarActiveTintColor: (project as any)?.tabBarConfig?.activeTintColor || '#007AFF',
                      tabBarInactiveTintColor: (project as any)?.tabBarConfig?.inactiveTintColor || '#8E8E93',
                      tabBarShowLabel: (project as any)?.tabBarConfig?.showLabels !== false,
                    }}
                  >
                    {tabBarScreens.map((sc: any) => (
                      <BottomTab.Screen
                        key={sc.pageId}
                        name={sc.name || 'Screen'}
                        options={{
                          tabBarIcon: ({ color, size }) => <Feather name={(sc.icon as any) || 'circle'} size={size} color={color} />,
                        }}
                        listeners={{ tabPress: e => { e.preventDefault(); setPageId(sc.pageId); } }}
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
                    screenOptions={{
                      headerShown: true,
                      drawerType: 'front',
                      drawerStyle: { backgroundColor: (project as any)?.drawerConfig?.backgroundColor || '#ffffff' },
                      drawerActiveTintColor: (project as any)?.drawerConfig?.activeTintColor || '#007AFF',
                      drawerInactiveTintColor: (project as any)?.drawerConfig?.inactiveTintColor || '#8E8E93',
                      headerLeft: ({ onPress }) => (
                        <Pressable onPress={onPress} style={{ padding: 12 }}>
                          <Feather name="menu" size={22} color={isAndroid ? '#000' : '#007AFF'} />
                        </Pressable>
                      ),
                    }}
                  >
                    {screens.filter((s: any) => currentGroup?.screenIds.includes(s.pageId)).map((sc: any) => (
                      <Drawer.Screen
                        key={sc.pageId}
                        name={sc.name || 'Screen'}
                        options={{
                          drawerIcon: ({ color, size }) => <Feather name={(sc.icon as any) || 'circle'} size={size} color={color} />,
                        }}
                        listeners={{ drawerItemPress: e => { setPageId(sc.pageId); } }}
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
"""

code = device_regex.sub(new_device_block.strip(), code)

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated index.tsx")
