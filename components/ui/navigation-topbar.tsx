import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import LogoIcon from '@/components/ui/icons/Logo';
import ProfileIcon from '@/components/ui/icons/Profile';

const VIEWBOX = { width: 393, height: 110 };
const MAIN_PATH_D = 'M0 0H393V64.8225C393 64.8225 339.5 78 196.5 78C53.5 78 0 64.8225 0 64.8225V0Z';
const SHADOW_PATH_D = 'M0 64.8225C0 64.8225 53.5 78 196.5 78C339.5 78 393 64.8225 393 64.8225V110H0Z';

export type NavigationTopBarProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  includeSafeAreaInset?: boolean;
};

export function NavigationTopBar({
  children,
  style,
  contentContainerStyle,
  includeSafeAreaInset = true,
}: NavigationTopBarProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = React.useState(0);

  const gradientId = React.useId();
  const shadowGradientId = `${gradientId}-shadow`;

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  const svgHeight = React.useMemo(() => {
    if (!width) {
      return VIEWBOX.height;
    }
    return (VIEWBOX.height / VIEWBOX.width) * width;
  }, [width]);

  const paddingTop = (includeSafeAreaInset ? insets.top : 0) + 12;
  const defaultContent = (
    <View style={styles.defaultRow}>
      <LogoIcon variant="gradient" width={36} height={16} />
      <ExpoLinearGradient
        colors={['#FFFFFF', 'rgba(255,255,255,0.5)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.profileBadge}
      >
        <ProfileIcon size={19} color="rgba(0,0,0,0.87)" />
      </ExpoLinearGradient>
    </View>
  );
  const renderedContent = children ?? defaultContent;

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      <View style={[styles.svgWrapper, { height: svgHeight }]}>
        <Svg
          pointerEvents="none"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        >
          <Defs>
            <LinearGradient
              id={gradientId}
              x1={VIEWBOX.width / 2}
              y1={0}
              x2={VIEWBOX.width / 2}
              y2={78}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#1590C6" />
              <Stop offset="0.73" stopColor="#12A5E5" />
              <Stop offset="1" stopColor="#12A5E5" stopOpacity={0.77} />
            </LinearGradient>
            <LinearGradient
              id={shadowGradientId}
              x1={VIEWBOX.width / 2}
              y1={64.8225}
              x2={VIEWBOX.width / 2}
              y2={VIEWBOX.height}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0" stopColor="#0F6FAF" stopOpacity={0.25} />
              <Stop offset="1" stopColor="#0F6FAF" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={SHADOW_PATH_D} fill={`url(#${shadowGradientId})`} />
          <Path d={MAIN_PATH_D} fill={`url(#${gradientId})`} />
        </Svg>
      </View>
      <View style={[styles.content, { paddingTop }, contentContainerStyle]}>{renderedContent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  svgWrapper: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    minHeight: 66,
    justifyContent: 'flex-end',
  },
  defaultRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileBadge: {
    width: 32,
    height: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
