import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { MoodDrawerProvider, useMoodDrawer } from '@/components/mood-drawer-context';
import CustomTabBar from '@/components/ui/custom-tabbar';
import { MoodDrawer } from '@/components/ui/mood-drawer';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function TabNavigator({ colorScheme }: { colorScheme: 'light' | 'dark' | undefined }) {
  const { isMoodDrawerOpen } = useMoodDrawer();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
      tabBar={(props) => (isMoodDrawerOpen ? null : <CustomTabBar {...props} />)}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: 'Videos',
        }}
      />
      <Tabs.Screen
        name="articles"
        options={{
          title: 'Articles',
        }}
      />
      <Tabs.Screen
        name="mood"
        options={{
          title: 'Mood',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Components',
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <MoodDrawerProvider>
      <TabNavigator colorScheme={colorScheme} />
      <MoodDrawer />
    </MoodDrawerProvider>
  );
}
