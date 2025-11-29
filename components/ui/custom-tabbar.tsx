import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMoodDrawer } from '@/components/mood-drawer-context';
import { IconSymbol } from './icon-symbol';

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { openMoodDrawer } = useMoodDrawer();

  const tabs = [
    { name: 'index', label: 'Home', icon: 'Logo' },
    { name: 'journal', label: 'Journal', icon: 'Pencil2' },
    { name: 'videos', label: 'Videos', icon: 'Play' },
    { name: 'articles', label: 'Articles', icon: 'Reader' },
  ];

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.container}>
        <LinearGradient
          colors={["#F2F2F2", "rgba(241,238,229,0.5)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.2 }}
          style={styles.pill}
        >
          {tabs.map((t, i) => {
            const focused = state.index === i;
            return (
              <Pressable
                key={t.name}
                onPress={() => navigation.navigate(t.name)}
                style={styles.tabItem}
                accessibilityRole="button">
                <IconSymbol name={t.icon as any} size={28} color={focused ? '#333' : '#666'} />
                <Text
                  style={[
                    styles.tabLabel,
                    focused ? styles.tabLabelActive : null,
                    { color: '#333' },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </LinearGradient>

        <Pressable onPress={openMoodDrawer} style={styles.fabWrapper} accessibilityRole="button">
          <LinearGradient
            colors={['#FFD07D', '#FFEECF']}
            // approximate 272deg by starting from the right and ending slightly up-left
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.3 }}
            style={styles.fab}
          >
            <IconSymbol name={'Plus' as any} size={36} color={'#111'} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    flex: 1,
    borderRadius: 80,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    // emulate gap by spacing tab items
    // shadow to match `box-shadow: 0 4px 4px 0 rgba(0,0,0,0.25);`
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 6,
    // Reserve vertical space so toggling fontWeight doesn't shift layout
    lineHeight: 16,
    minHeight: 16,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  fabWrapper: {
    marginLeft: 12,
  },
  fab: {
    // match provided CSS: width 72, height 73, padding 11 20, borderRadius 80
    width: 72,
    height: 73,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow to match requested box-shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});
