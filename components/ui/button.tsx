import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'regular' | 'compact';

interface ButtonProps {
  onPress: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  gradient?: readonly [string, string];
  block?: boolean;
  disabled?: boolean;
}

const VARIANT_GRADIENTS: Record<ButtonVariant, readonly [string, string]> = {
  primary: ['#FFEECF', '#FFD07D'],
  secondary: ['#F2F2F2', 'rgba(241, 238, 229, 0.5)'],
};

const SIZE_PRESETS: Record<ButtonSize, ViewStyle> = {
  regular: {
    paddingVertical: 11,
    paddingHorizontal: 20,
    minHeight: 45,
    gap: 10,
  },
  compact: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
};

const DEFAULT_SIZE_BY_VARIANT: Record<ButtonVariant, ButtonSize> = {
  primary: 'regular',
  secondary: 'compact',
};

export function Button({
  onPress,
  children = null,
  style,
  variant = 'primary',
  size,
  gradient,
  block = false,
  disabled = false,
}: ButtonProps) {
  const resolvedGradient = gradient ?? VARIANT_GRADIENTS[variant];
  const resolvedSize = size ?? DEFAULT_SIZE_BY_VARIANT[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        block && styles.block,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <LinearGradient
        colors={resolvedGradient}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.gradientBase, SIZE_PRESETS[resolvedSize], block && styles.blockGradient]}>
        {children}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 33,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  block: {
    width: '100%',
    alignSelf: 'stretch',
  },
  blockGradient: {
    width: '100%',
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.6,
  },
  gradientBase: {
    borderRadius: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});