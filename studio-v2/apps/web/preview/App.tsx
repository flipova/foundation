import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FoundationProvider } from '@flipova/foundation';
import config from './flipova.config';
import HomeScreen from './src/screens/tabs/HomeScreen';
import ExplorerScreen from './src/screens/tabs/ExplorerScreen';

const RootStack = createStackNavigator();

const SafeScreen = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
);

const _Tab__tabs_Navigator = createBottomTabNavigator();
function _tabs_Navigator() {
  return (
    <_Tab__tabs_Navigator.Navigator initialRouteName="home" screenOptions={{ tabBarStyle: { backgroundColor: "$theme.background" } }}>
    <_Tab__tabs_Navigator.Screen name="home" component={HomeScreen} options={{ title: "Home", tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={"home" as any} size={size} color={color} /> }} />
    <_Tab__tabs_Navigator.Screen name="explorer" component={ExplorerScreen} options={{ title: "Explorer", tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={"search" as any} size={size} color={color} /> }} />
    </_Tab__tabs_Navigator.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <FoundationProvider config={config}>
        <NavigationContainer>
          <RootStack.Navigator initialRouteName="tabs" screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="tabs" component={_tabs_Navigator} options={{ headerShown: false }} />
          </RootStack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" translucent={false} backgroundColor="$color.black" />
      </FoundationProvider>
    </SafeAreaProvider>
  );
}
