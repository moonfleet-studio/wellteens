import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { LayoutChangeEvent, Modal, Pressable, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import LogoIcon from '@/components/ui/icons/Logo';
import ProfileIcon from '@/components/ui/icons/Profile';
import { useAuth } from '@/context/AuthContext';

// Base content height (excluding safe area) - the minimum space for the navbar content
const BASE_CONTENT_HEIGHT = 56;
// The curve/arc portion at the bottom of the navbar
const CURVE_HEIGHT = 20;
// Shadow extension below the curve
const SHADOW_HEIGHT = 32;

// Generate SVG paths dynamically based on width and heights
const generatePaths = (width: number, mainHeight: number, totalHeight: number) => {
  const curveY = mainHeight - CURVE_HEIGHT;
  const centerX = width / 2;
  const curveControlOffset = width * 0.363; // ~143/393 ratio from original

  return {
    main: `M0 0H${width}V${curveY}C${width} ${curveY} ${centerX + curveControlOffset} ${mainHeight} ${centerX} ${mainHeight}C${centerX - curveControlOffset} ${mainHeight} 0 ${curveY} 0 ${curveY}V0Z`,
    shadow: `M0 ${curveY}C0 ${curveY} ${centerX - curveControlOffset} ${mainHeight} ${centerX} ${mainHeight}C${centerX + curveControlOffset} ${mainHeight} ${width} ${curveY} ${width} ${curveY}V${totalHeight}H0Z`,
  };
};

export type NavigationTopBarProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  includeSafeAreaInset?: boolean;
  /** Shared value for nav hidden offset (0 = fully visible, hideDistance = fully hidden) */
  navHiddenOffset?: SharedValue<number>;
  /** Distance to scroll before content is fully hidden (default: 50) */
  hideDistance?: number;
};

export function NavigationTopBar({
  children,
  style,
  contentContainerStyle,
  includeSafeAreaInset = true,
  navHiddenOffset,
  hideDistance = 50,
}: NavigationTopBarProps) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = React.useState(0);
  const [showLogoutMenu, setShowLogoutMenu] = React.useState(false);
  const { logout } = useAuth();

  const gradientId = React.useId();
  const shadowGradientId = `${gradientId}-shadow`;

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  }, []);

  // Calculate heights based on safe area
  const safeAreaTop = includeSafeAreaInset ? insets.top : 0;
  const mainHeight = safeAreaTop + BASE_CONTENT_HEIGHT + CURVE_HEIGHT;
  const totalHeight = mainHeight + SHADOW_HEIGHT;

  // Generate paths dynamically based on actual width
  const paths = React.useMemo(() => {
    if (!width) return null;
    return generatePaths(width, mainHeight, totalHeight);
  }, [width, mainHeight, totalHeight]);

  // Animated styles for hiding content on scroll using Reanimated
  // Uses navHiddenOffset which is calculated via useAnimatedReaction for better Safari/web compatibility
  const contentAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const hiddenValue = navHiddenOffset?.value ?? 0;
    
    const opacity = interpolate(
      hiddenValue,
      [0, hideDistance],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    const translateY = interpolate(
      hiddenValue,
      [0, hideDistance],
      [0, -10],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  }, [navHiddenOffset, hideDistance]);

  const handleLogout = React.useCallback(async () => {
    setShowLogoutMenu(false);
    await logout();
  }, [logout]);

  const paddingTop = safeAreaTop + 8;
  const defaultContent = (
    <View style={styles.defaultRow}>
      <LogoIcon variant="gradient" width={36} height={16} />
      <TouchableOpacity 
        onPress={() => setShowLogoutMenu(true)}
        accessibilityRole="button"
        accessibilityLabel="Profile menu"
      >
        <ExpoLinearGradient
          colors={['#FFFFFF', 'rgba(255,255,255,0.5)']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.profileBadge}
        >
          <ProfileIcon size={19} color="rgba(0,0,0,0.87)" />
        </ExpoLinearGradient>
      </TouchableOpacity>
    </View>
  );
  const renderedContent = children ?? defaultContent;

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      {paths && (
        <View style={[styles.svgWrapper, { height: totalHeight }]}>
          <Svg
            pointerEvents="none"
            width={width}
            height={totalHeight}
            viewBox={`0 0 ${width} ${totalHeight}`}
          >
            <Defs>
              <LinearGradient
                id={gradientId}
                x1={width / 2}
                y1={0}
                x2={width / 2}
                y2={mainHeight}
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor="#1590C6" />
                <Stop offset="0.73" stopColor="#12A5E5" />
                <Stop offset="1" stopColor="#12A5E5" stopOpacity={0.77} />
              </LinearGradient>
              <LinearGradient
                id={shadowGradientId}
                x1={width / 2}
                y1={mainHeight - CURVE_HEIGHT}
                x2={width / 2}
                y2={totalHeight}
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor="#0F6FAF" stopOpacity={0.25} />
                <Stop offset="1" stopColor="#0F6FAF" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Path d={paths.shadow} fill={`url(#${shadowGradientId})`} />
            <Path d={paths.main} fill={`url(#${gradientId})`} />
          </Svg>
        </View>
      )}
      <View style={[styles.content, { paddingTop }, contentContainerStyle]}>
        <Animated.View style={contentAnimatedStyle}>
          {renderedContent}
        </Animated.View>
      </View>

      {/* Logout Menu Modal */}
      <Modal
        visible={showLogoutMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutMenu(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowLogoutMenu(false)}
        >
          <View style={styles.menuContainer}>
            <Button
              onPress={handleLogout}
              variant="secondary"
              style={styles.logoutButton}
              size='regular'
            >
              <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
            </Button>
          </View>
        </Pressable>
      </Modal>
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
    paddingBottom: 16,
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 24,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 150,
    padding: 12,
  },
  logoutButton: {
    width: '100%',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
