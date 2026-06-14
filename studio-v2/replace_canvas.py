import re

path = 'c:/Users/david/Documents/Github/foundation/studio-v2/apps/web/src/ui/panels/canvas/index.tsx'
with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

status_bar_old = r"""const StatusBarChrome: React\.FC<\{ isAndroid: boolean; statusBarConfig\?: any \}> = \(\{ isAndroid, statusBarConfig \}\) => \{
  const isDark = statusBarConfig\?\.style === 'dark';
  const textColor = isDark \? '#fff' : '#000';
  const bgColor = statusBarConfig\?\.backgroundColor \|\| \(statusBarConfig\?\.translucent \? 'transparent' : undefined\);
  return \(
    <View style=\{\[s\.statusBar, isAndroid && s\.statusBarAndroid, bgColor \? \{ backgroundColor: bgColor \} : undefined\]\}>
      <Text style=\{\[s\.statusTime, \{ color: textColor \}\]\}>\{isAndroid \? '12:00' : '9:41'\}</Text>
      <View style=\{s\.statusRight\}>
        <Feather name="wifi" size=\{12\} color=\{textColor\} />
        <Feather name=\{isAndroid \? 'bar-chart' : 'bar-chart-2'\} size=\{12\} color=\{textColor\} style=\{\{ transform: \[\{ rotate: '90deg' \}\] \}\} />
        <View style=\{s\.battery\}>
          <View style=\{\[s\.batteryFill, \{ backgroundColor: textColor \}\]\} />
        </View>
      </View>
    </View>
  \);
\};"""

status_bar_new = """const StatusBarChrome: React.FC<{ isAndroid: boolean; statusBarConfig?: any }> = ({ isAndroid, statusBarConfig }) => {
  const isDark = statusBarConfig?.style === 'dark';
  const textColor = isDark ? '#fff' : '#000';
  const bgColor = statusBarConfig?.backgroundColor || (statusBarConfig?.translucent ? 'transparent' : undefined);
  const isHidden = statusBarConfig?.hidden;
  
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
};"""

code = re.sub(status_bar_old, status_bar_new, code)

# We also need Drawer UI mockup.
drawer_header_regex = r"""const DrawerHeader.*? \);\n\};"""

drawer_ui = """const DrawerHeader: React.FC<{ title: string; isAndroid: boolean; onOpenDrawer: () => void }> = ({ title, isAndroid, onOpenDrawer }) => (
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
        {screens.map(sc => {
          const active = sc.pageId === activePageId;
          return (
            <Pressable key={sc.pageId} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: active ? activeTint + '15' : 'transparent' }} onPress={() => { onSelect(sc.pageId); onClose(); }}>
              <Feather name={sc.icon || 'circle'} size={20} color={active ? activeTint : inactiveTint} style={{ marginRight: 16 }} />
              <Text style={{ fontSize: 16, fontWeight: active ? '600' : '400', color: active ? activeTint : inactiveTint }}>{sc.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
"""

code = re.sub(drawer_header_regex, drawer_ui, code, flags=re.DOTALL)

# Now inject drawer state into DeviceCanvas component
code = code.replace("const [canvasWidth, setCanvasWidth] = useState(0);", "const [canvasWidth, setCanvasWidth] = useState(0);\n  const [drawerOpen, setDrawerOpen] = useState(false);")

# Update render for StackHeader/DrawerHeader/DrawerOverlay
# Replace `{isInDrawerGroup && <DrawerHeader title={activePageName} isAndroid={isAndroid} />}`
code = code.replace(
    "{isInDrawerGroup && <DrawerHeader title={activePageName} isAndroid={isAndroid} />}",
    "{isInDrawerGroup && <DrawerHeader title={activePageName} isAndroid={isAndroid} onOpenDrawer={() => setDrawerOpen(true)} />}"
)

# Insert DrawerOverlay after the device root
overlay_code = """
            {isInTabsGroup && tabBarScreens.length > 0 && <TabBar screens={tabBarScreens} activePageId={pageId} onSelect={setPageId} isAndroid={isAndroid} tabBarConfig={(project as any)?.tabBarConfig} />}
            {isPhone && <View style={s.homeBar}><View style={s.homeIndicator} /></View>}
            {isInDrawerGroup && <DrawerOverlay isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} screens={screens.filter((s: any) => currentGroup?.screenIds.includes(s.pageId))} activePageId={pageId} onSelect={setPageId} drawerConfig={(project as any)?.drawerConfig} />}
"""
code = code.replace(
    "{isInTabsGroup && tabBarScreens.length > 0 && <TabBar screens={tabBarScreens} activePageId={pageId} onSelect={setPageId} isAndroid={isAndroid} tabBarConfig={(project as any)?.tabBarConfig} />}\n            {isPhone && <View style={s.homeBar}><View style={s.homeIndicator} /></View>}",
    overlay_code.strip()
)

# Increase status bar padding in styles for realism
code = code.replace("paddingHorizontal: 24, paddingBottom: 6", "paddingHorizontal: 32, paddingBottom: 12")

with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated canvas/index.tsx")
