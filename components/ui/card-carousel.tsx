import React, { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import type { PanGestureHandlerProps } from 'react-native-gesture-handler';
import Carousel, { type CarouselRenderItemInfo } from 'react-native-snap-carousel';

export type CardCarouselRenderItem<T> = (item: T, index: number) => ReactNode;

type CardCarouselProps<T> = {
  data: readonly T[];
  renderItem: CardCarouselRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  height?: number;
  peek?: number;
  loop?: boolean;
  parallaxOffset?: number;
  gap?: number;
  panGestureHandlerProps?: PanGestureHandlerProps;
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
  parallaxOffset = 52,
  gap = 16,
  panGestureHandlerProps: _panGestureHandlerProps,
  style,
}: CardCarouselProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<Carousel | null>(null);
  const webListRef = useRef<FlatList<T> | null>(null);
  const carouselData = useMemo(() => [...data], [data]);
  const safePeek = Math.max(0, peek);
  const halfGap = Math.max(0, gap / 2);
  const isWeb = Platform.OS === 'web';

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

  const containerHorizontalPadding = useMemo(
    () => (halfGap > 0 ? Math.max(0, safePeek - halfGap) : safePeek),
    [halfGap, safePeek]
  );

  const extendedListWidth = useMemo(() => {
    if (containerWidth <= 0) return undefined;
    return containerWidth + safePeek * 2;
  }, [containerWidth, safePeek]);

  const slideParallaxStyle = useMemo(() => {
    if (!parallaxOffset) return null;
    return {
      transform: [
        {
          translateX: Math.max(-safePeek, Math.min(parallaxOffset, safePeek)) * 0.15,
        },
      ],
    };
  }, [parallaxOffset, safePeek]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const nextWidth = event.nativeEvent.layout.width;
      if (nextWidth && nextWidth !== containerWidth) {
        setContainerWidth(nextWidth);
      }
    },
    [containerWidth]
  );

  const handleSnap = useCallback(
    (index: number) => {
      if (carouselData.length === 0) return;
      const clampedIndex = Math.max(0, Math.min(index, carouselData.length - 1));
      setActiveIndex((prev) => (prev === clampedIndex ? prev : clampedIndex));
    },
    [carouselData.length]
  );

  const handleDotPress = useCallback(
    (index: number) => {
      if (isWeb) {
        webListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
        return;
      }
      carouselRef.current?.snapToItem(index, true);
    },
    [isWeb]
  );

  const snapInterval = useMemo(() => (carouselItemWidth > 0 ? carouselItemWidth : 0), [carouselItemWidth]);

  const handleWebScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isWeb || snapInterval <= 0 || carouselData.length === 0) return;
      const offsetX = event.nativeEvent.contentOffset.x;
      if (!Number.isFinite(offsetX)) return;
      const rawIndex = Math.round(offsetX / snapInterval);
      const clampedIndex = Math.max(0, Math.min(rawIndex, carouselData.length - 1));
      setActiveIndex((prev) => (prev === clampedIndex ? prev : clampedIndex));
    },
    [carouselData.length, isWeb, snapInterval]
  );

  const shouldRenderCarousel = carouselItemWidth > 0 && carouselData.length > 0;

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      {shouldRenderCarousel ? (
        isWeb ? (
          <FlatList
            ref={webListRef}
            style={[styles.webList, { marginHorizontal: -safePeek, width: extendedListWidth }]}
            contentContainerStyle={[styles.webListContent, { paddingHorizontal: safePeek }]}
            data={carouselData}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={snapInterval}
            snapToAlignment="center"
            disableIntervalMomentum
            onScroll={handleWebScroll}
            onMomentumScrollEnd={handleWebScroll}
            onScrollEndDrag={handleWebScroll}
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
        ) : (
          <Carousel
            ref={carouselRef}
            items={carouselData}
            renderItem={(info: CarouselRenderItemInfo<T>) => renderItem(info.item, info.index)}
            sliderWidth={containerWidth}
            itemWidth={carouselItemWidth}
            containerCustomStyle={[styles.carouselShell, { height }]}
            contentContainerCustomStyle={[styles.carouselContent, { paddingHorizontal: containerHorizontalPadding }]}
            slideStyle={[
              styles.slide,
              {
                width: slideWidth,
                marginHorizontal: halfGap,
              },
              slideParallaxStyle,
            ]}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            loop={loop}
            snapOnAndroid
            enableSnap
            onSnapToItem={handleSnap}
            showsHorizontalScrollIndicator={false}
          />
        )
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
  carouselShell: {
    width: '100%',
  },
  webList: {
    width: '100%',
  },
  webListContent: {
    paddingVertical: 6,
  },
  carouselContent: {
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
