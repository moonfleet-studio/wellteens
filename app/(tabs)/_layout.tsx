import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import CustomTabBar from '@/components/ui/custom-tabbar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    tabBar={(props) => <CustomTabBar {...props} />}
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
