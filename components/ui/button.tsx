import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonVariant;
  disabled?: boolean;
}

const VARIANT_PRESETS: Record<ButtonVariant, { gradient: readonly [string, string]; contentStyle: ViewStyle }> = {
  primary: {
    gradient: ['#FFD07D', '#FFEECF'],
    contentStyle: {
      paddingVertical: 11,
      paddingHorizontal: 20,
      minHeight: 45,
      gap: 10,
    },
  },
  secondary: {
    gradient: ['#F2F2F2', 'rgba(241, 238, 229, 0.5)'],
    contentStyle: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      gap: 4,
    },
  },
};

export function Button({
  onPress,
  children,
  style,
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const preset = VARIANT_PRESETS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <LinearGradient
        colors={preset.gradient}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.gradientBase, preset.contentStyle]}>
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