import type { PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import Footer from '@/components/ui/footer';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

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
    <ThemedView style={[styles.content, contentContainerStyle]}>
      {children}
      {footer}
    </ThemedView>
  );

  if (headerImage) {
    return (
      <SafeAreaView style={styles.root}>
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
});
