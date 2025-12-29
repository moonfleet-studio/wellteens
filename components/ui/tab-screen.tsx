import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import React from 'react';
import { SafeAreaView, StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
  useSharedValue,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Footer from '@/components/ui/footer';
import { NavigationTopBar } from '@/components/ui/navigation-topbar';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;
const NAVIGATION_BAR_HEIGHT = 66;

type TabScreenProps = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { light: string; dark: string };
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerContent?: ReactNode;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
}>;

export default function TabScreen({
  children,
  headerImage,
  headerBackgroundColor = { light: '#FFFFFF', dark: '#1C1C1C' },
  contentContainerStyle,
  headerContent,
  title,
  titleStyle,
}: TabScreenProps) {
  const footer = <Footer />;
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const navHiddenOffset = useSharedValue(0);
  const lastStableScrollOffset = useSharedValue(0);
  const headerHeight = headerImage ? HEADER_HEIGHT : NAVIGATION_BAR_HEIGHT;
  const safeHeaderHeight = headerHeight > 0 ? headerHeight : 1;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-safeHeaderHeight, 0, safeHeaderHeight],
            [-safeHeaderHeight / 2, 0, safeHeaderHeight * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-safeHeaderHeight, 0, safeHeaderHeight], [2, 1, 1]),
        },
      ],
    };
  });

  const content = (
    <ThemedView
      style={[styles.content, { paddingTop: 16 }, contentContainerStyle]}
    >
      {headerContent ? <View style={styles.headerContent}>{headerContent}</View> : null}
      {title ? (
        <ThemedText type="title" style={[styles.tabTitle, titleStyle]} accessibilityRole="header">
          {title}
        </ThemedText>
      ) : null}
      {children}
      {footer}
    </ThemedView>
  );

  // Track navbar visibility based on scroll direction
  // Ignore rubber-banding (bounce) at top and bottom edges on Safari/iOS
  useAnimatedReaction(
    () => scrollOffset.value,
    (current, previous) => {
      'worklet';
      if (previous === null || previous === undefined) {
        navHiddenOffset.value = 0;
        lastStableScrollOffset.value = 0;
        return;
      }

      // Ignore rubber-banding at the top (negative scroll values)
      if (current < 0 || previous < 0) {
        return;
      }

      const diff = current - previous;

      // Add a small threshold to ignore tiny bounce movements
      if (Math.abs(diff) < 0.5) {
        return;
      }

      // When at the very top, always show the navbar
      if (current <= 5) {
        navHiddenOffset.value = 0;
        lastStableScrollOffset.value = current;
        return;
      }

      // Detect bottom rubber-banding: if we were scrolling down and suddenly 
      // the scroll position decreases without user intent (bounce back from bottom)
      // We detect this by checking if current < lastStableScrollOffset while scrolling "up"
      const isScrollingUp = diff < 0;
      
      if (isScrollingUp) {
        // If the current position is higher than last stable position,
        // this is likely a bottom bounce - ignore it
        if (current > lastStableScrollOffset.value - NAVIGATION_BAR_HEIGHT) {
          // Check if we bounced back from a higher position (bottom bounce)
          // Only update navbar if we've scrolled up significantly from last stable point
          const scrolledUpAmount = lastStableScrollOffset.value - current;
          if (scrolledUpAmount < NAVIGATION_BAR_HEIGHT) {
            // Not enough intentional scroll up, could be bounce - ignore
            return;
          }
        }
      } else {
        // Scrolling down - update the last stable position
        lastStableScrollOffset.value = Math.max(lastStableScrollOffset.value, current);
      }

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
      <NavigationTopBar navHiddenOffset={navHiddenOffset} hideDistance={NAVIGATION_BAR_HEIGHT} />
    </Animated.View>
  );

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
            { height: headerHeight, backgroundColor: headerBackgroundColor[colorScheme], overflow: 'hidden' },
            headerAnimatedStyle,
          ]}>
          {headerImage ?? null}
        </Animated.View>
        {content}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    marginTop: NAVIGATION_BAR_HEIGHT,
  },
  content: {
    flex: 1,
    gap: 20,
    paddingHorizontal: 24,
  },
  headerContent: {
    width: '100%',
  },
  tabTitle: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
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
