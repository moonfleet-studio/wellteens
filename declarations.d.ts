declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-snap-carousel' {
  import * as React from 'react';
  import { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

  export interface CarouselRenderItemInfo<T> {
    item: T;
    index: number;
  }

  export interface CarouselProps<T> extends ScrollViewProps {
    items: readonly T[];
    renderItem: (info: CarouselRenderItemInfo<T>) => React.ReactNode;
    sliderWidth: number;
    itemWidth: number;
    containerCustomStyle?: StyleProp<ViewStyle>;
    contentContainerCustomStyle?: StyleProp<ViewStyle>;
    slideStyle?: StyleProp<ViewStyle>;
    inactiveSlideScale?: number;
    inactiveSlideOpacity?: number;
    loop?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
    autoplayDelay?: number;
    enableSnap?: boolean;
    snapOnAndroid?: boolean;
    onSnapToItem?: (index: number, item: T) => void;
    showsHorizontalScrollIndicator?: boolean;
  }

  export default class Carousel<T = unknown> extends React.Component<CarouselProps<T>> {
    snapToItem(index: number, animated?: boolean): void;
  }
}
