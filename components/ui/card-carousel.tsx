import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export type CardCarouselRenderItem<T> = (item: T, index: number) => ReactNode;

type CardCarouselProps<T> = {
  data: readonly T[];
  renderItem: CardCarouselRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  height?: number;
  peek?: number;
  loop?: boolean;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

const defaultKeyExtractor = (_item: unknown, index: number) => index.toString();

export function CardCarousel<T>({
  data,
  renderItem,
  keyExtractor = defaultKeyExtractor,
  height = 280,
  peek = 32,
  loop = false,
  gap = 16,
  style,
}: CardCarouselProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<T> | null>(null);
  const carouselData = useMemo(() => [...data], [data]);
  const safePeek = Math.max(0, peek);

  const trackWidth = useMemo(() => {
    if (containerWidth <= 0) return 0;
    const widthMinusPeek = containerWidth - safePeek * 2;
    return widthMinusPeek > 0 ? widthMinusPeek : containerWidth;
  }, [containerWidth, safePeek]);

  const slideWidth = useMemo(() => {
    if (trackWidth <= 0) return 0;
    const widthWithoutGap = trackWidth - gap;
    return widthWithoutGap > 0 ? widthWithoutGap : trackWidth;
  }, [trackWidth, gap]);

  const carouselItemWidth = useMemo(() => (slideWidth > 0 ? slideWidth + gap : 0), [slideWidth, gap]);

  const extendedListWidth = useMemo(() => {
    if (containerWidth <= 0) return undefined;
    return containerWidth + safePeek * 2;
  }, [containerWidth, safePeek]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;
      if (nextWidth && nextWidth !== containerWidth) {
        setContainerWidth(nextWidth);
      }
    },
    [containerWidth]
  );

  const handleDotPress = useCallback(
    (index: number) => {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    },
    []
  );

  const snapInterval = useMemo(() => (carouselItemWidth > 0 ? carouselItemWidth : 0), [carouselItemWidth]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (snapInterval <= 0 || carouselData.length === 0) return;
      const offsetX = event.nativeEvent.contentOffset.x;
      if (!Number.isFinite(offsetX)) return;
      const rawIndex = Math.round(offsetX / snapInterval);
      const clampedIndex = Math.max(0, Math.min(rawIndex, carouselData.length - 1));
      setActiveIndex((prev) => (prev === clampedIndex ? prev : clampedIndex));
    },
    [carouselData.length, snapInterval]
  );

  const shouldRenderCarousel = carouselItemWidth > 0 && carouselData.length > 0;

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      {shouldRenderCarousel ? (
        <FlatList
          ref={listRef}
          style={[styles.list, { marginHorizontal: -safePeek, width: extendedListWidth }]}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: safePeek }]}
          data={carouselData}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={snapInterval}
          snapToAlignment="center"
          disableIntervalMomentum
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
          onScrollEndDrag={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item, index }: { item: T; index: number }) => (
            <View
              style={[
                styles.slide,
                {
                  width: slideWidth,
                  marginRight: index === carouselData.length - 1 ? 0 : gap,
                },
              ]}
            >
              {renderItem(item, index)}
            </View>
          )}
        />
      ) : null}

      {carouselData.length > 0 ? (
        <View style={styles.dotsRow}>
          {carouselData.map((_, index) => (
            <TouchableOpacity
              key={keyExtractor ? keyExtractor(carouselData[index], index) : `${index}`}
              style={[styles.dot, index === activeIndex && styles.dotActive]}
              onPress={() => handleDotPress(index)}
              activeOpacity={0.8}
              accessibilityRole="text"
              accessibilityLabel={`Slide ${index + 1} of ${carouselData.length}`}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingVertical: 6,
  },
  slide: {
    flex: 1,
    paddingVertical: 6,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(12,32,66,0.2)',
  },
  dotActive: {
    width: 8,
    backgroundColor: '#2FB6FF',
  },
});
