import type { PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
  useSharedValue,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import Footer from '@/components/ui/footer';
import { NavigationTopBar } from '@/components/ui/navigation-topbar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;
const NAVIGATION_BAR_HEIGHT = 66;

type TabScreenProps = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { light: string; dark: string };
  contentContainerStyle?: StyleProp<ViewStyle>;
}>;

export default function TabScreen({
  children,
  headerImage,
  headerBackgroundColor = { light: '#FFFFFF', dark: '#1C1C1C' },
  contentContainerStyle,
}: TabScreenProps) {
  const footer = <Footer />;
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const navHiddenOffset = useSharedValue(0);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });
  const content = (
    <ThemedView
      style={[styles.content, { paddingTop: headerImage ? 16 : NAVIGATION_BAR_HEIGHT + 16 }, contentContainerStyle]}
    >
      {children}
      {footer}
    </ThemedView>
  );
  useAnimatedReaction(
    () => scrollOffset.value,
    (current, previous) => {
      if (previous === null || previous === undefined) {
        navHiddenOffset.value = 0;
        return;
      }
      const diff = current - previous;
      const next = Math.min(Math.max(navHiddenOffset.value + diff, 0), NAVIGATION_BAR_HEIGHT);
      navHiddenOffset.value = next;
    }
  );
  const navBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -navHiddenOffset.value }],
    };
  });
  const navigationBar = (
    <Animated.View style={[styles.navBarWrapper, navBarAnimatedStyle]}>
      <NavigationTopBar />
    </Animated.View>
  );

  if (headerImage) {
    return (
      <SafeAreaView style={styles.root}>
        <View pointerEvents="box-none" style={styles.navBarContainer}>
          {navigationBar}
        </View>
        <Animated.ScrollView
          ref={scrollRef}
          style={{ backgroundColor, flex: 1 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.header,
              { backgroundColor: headerBackgroundColor[colorScheme], overflow: 'hidden' },
              headerAnimatedStyle,
            ]}>
            {headerImage}
          </Animated.View>
          {content}
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View pointerEvents="box-none" style={styles.navBarContainer}>
        {navigationBar}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {content}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: HEADER_HEIGHT,
    marginTop: NAVIGATION_BAR_HEIGHT,
  },
  content: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingVertical: 24,
    flexGrow: 1,
  },
  navBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navBarWrapper: {
    width: '100%',
  },
});
