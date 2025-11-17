import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

const CARD_HEIGHT = 150;
const CARD_RADIUS = 28;
const TITLE_LINE_HEIGHT = 20;
const TITLE_MARGIN_BOTTOM = 8;
const TITLE_MAX_WIDTH = 154;
const TITLE_MAX_WIDTH_WITH_ACCESSORY = 120;
const CHART_HEIGHT = 90;
const ENDPOINT_OFFSET = 16;
const VALUE_MIN = 1;
const VALUE_MAX = 5;

const BACKGROUND_TEXTURE_PATHS = [
  'M -50 60 C 40 10, 160 10, 260 60 S 480 110, 560 40',
  'M -80 110 C 20 60, 200 40, 320 80 S 520 150, 620 70',
  'M -60 150 C 40 120, 200 130, 320 160 S 520 200, 640 140',
];

export type MoodHistoryPoint = {
  date: string;
  value: number;
};

export type MoodHistoryCardProps = {
  data: MoodHistoryPoint[];
  title?: string;
  style?: StyleProp<ViewStyle>;
  accessory?: React.ReactNode;
};

type ChartGeometry = {
  linePath: string;
  areaPath: string;
  lastPoint: { x: number; y: number } | null;
  areaOverflowLeft: number;
};

export function MoodHistoryCard({
  data,
  title = 'Mood history',
  style,
  accessory,
}: MoodHistoryCardProps) {
  const [width, setWidth] = React.useState(0);

  const chart = React.useMemo<ChartGeometry>(() => {
    if (!width || data.length < 2) {
      return {
        linePath: '',
        areaPath: '',
        lastPoint: null,
        areaOverflowLeft: 0,
      };
    }

    const clampValue = (value: number) => {
      return Math.min(VALUE_MAX, Math.max(VALUE_MIN, value));
    };

    const normalize = (value: number) => {
      const ratio = (clampValue(value) - VALUE_MIN) / (VALUE_MAX - VALUE_MIN);
      return CHART_HEIGHT - ratio * (CHART_HEIGHT * 0.7);
    };

    const maxX = Math.max(0, width - ENDPOINT_OFFSET);
    const areaOverflowLeft = Math.min(width * 0.35, 120);

    const points = data.map((point, index) => ({
      x: (maxX * index) / (data.length - 1),
      y: normalize(point.value),
    }));

    const smoothing = 0.42;

    const cubicPath = points.reduce((acc, point, index, arr) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = arr[index - 1];
      const deltaX = point.x - previous.x;
      const controlPoint1X = previous.x + deltaX * smoothing;
      const controlPoint2X = point.x - deltaX * smoothing;

      return (
        acc +
        ` C ${controlPoint1X} ${previous.y}, ${controlPoint2X} ${point.y}, ${point.x} ${point.y}`
      );
    }, '');

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const tailX = width;
    const areaPath = `${cubicPath} L ${tailX} ${lastPoint.y} L ${tailX} ${CHART_HEIGHT} L ${firstPoint.x - areaOverflowLeft} ${CHART_HEIGHT} Z`;

    return {
      linePath: cubicPath,
      areaPath,
      lastPoint,
      areaOverflowLeft,
    };
  }, [width, data]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth !== width) {
      setWidth(nextWidth);
    }
  };

  const showPlaceholder = data.length < 2;

  return (
    <ExpoLinearGradient
      colors={['#FFEECF', '#FFD07D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrapper, style]}
    >
      <ExpoLinearGradient
        pointerEvents="none"
        colors={['#FFECCA', 'rgba(255,236,202,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.leftEffect}
      />

      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 220"
        preserveAspectRatio="none"
        style={styles.texture}
        pointerEvents="none"
      >
        {BACKGROUND_TEXTURE_PATHS.map((d, index) => (
          <Path
            key={index}
            d={d}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={2}
          />
        ))}
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.title, accessory ? styles.titleInset : null]}>{title}</Text>
        <View style={styles.chartContainer} onLayout={handleLayout}>
          {width > 0 && !showPlaceholder ? (
            <Svg width={width} height={CHART_HEIGHT}>
              <Defs>
                <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#45D0EE" stopOpacity={0.5} />
                  <Stop offset="100%" stopColor="#45D0EE" stopOpacity={0} />
                </LinearGradient>

                <ClipPath id="chartClip">
                  <Rect
                    x={-chart.areaOverflowLeft}
                    y={0}
                    width={width + chart.areaOverflowLeft}
                    height={CHART_HEIGHT}
                  />
                </ClipPath>
              </Defs>

              <G clipPath="url(#chartClip)">
                {chart.areaPath ? (
                  <Path d={chart.areaPath} fill="url(#areaGradient)" />
                ) : null}

                {chart.linePath ? (
                  <Path
                    d={chart.linePath}
                    stroke="#07A5FF"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                ) : null}

                {chart.lastPoint ? (
                  <Circle
                    cx={chart.lastPoint.x}
                    cy={chart.lastPoint.y}
                    r={3.5}
                    fill="#07A5FF"
                  />
                ) : null}
              </G>
            </Svg>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderLabel}>
                Add at least two mood entries to see your history.
              </Text>
            </View>
          )}
        </View>
      </View>

      {accessory ? <View style={styles.accessorySlot}>{accessory}</View> : null}
    </ExpoLinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: CARD_HEIGHT,
    borderRadius: CARD_RADIUS,
    alignSelf: 'stretch',
    overflow: 'hidden',
    shadowColor: '#F2C188',
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 12,
    marginBottom: 16,
    position: 'relative',
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3A332D',
    lineHeight: TITLE_LINE_HEIGHT,
    marginBottom: TITLE_MARGIN_BOTTOM,
    maxWidth: TITLE_MAX_WIDTH,
    marginLeft: 16,
    marginTop: 16,
  },
  titleInset: {
    maxWidth: TITLE_MAX_WIDTH_WITH_ACCESSORY,
  },
  chartContainer: {
    width: '100%',
    height: CHART_HEIGHT,
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  placeholderLabel: {
    textAlign: 'center',
    color: '#5C5C5C',
    fontSize: 14,
  },
  leftEffect: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 27,
    zIndex: 1,
  },
  accessorySlot: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    right: 4,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
