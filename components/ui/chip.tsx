import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

export type ChipVariant = 'video' | 'videoCompact' | 'article' | 'module' | 'mood';

interface ChipProps {
  variant?: ChipVariant;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ variant = 'article', label, onPress, style }: ChipProps) {
  const isVideo = variant === 'video' || variant === 'videoCompact';
  const isCompact = variant === 'videoCompact';
  const dimensionStyle = isCompact ? styles.compactDimensions : undefined;
  const paddingStyle = isCompact ? styles.compactPadding : styles.standardPadding;

  const content = (
    <ThemedText
      type="defaultSemiBold"
      style={[styles.label, paddingStyle, isVideo && styles.labelWhite, isCompact && styles.compactLabel]}
    >
      {label}
    </ThemedText>
  );

  if (variant === 'mood') {
    return (
      <Pressable
        accessibilityRole={onPress ? 'button' : 'text'}
        onPress={onPress}
        style={[styles.moodWrap, style]}>
        {content}
      </Pressable>
    );
  }

  const gradients: Record<Exclude<ChipVariant, 'mood'>, readonly [string, string]> = {
    video: ['#2EA3E0', '#0A6EA8'],
    videoCompact: ['#2EA3E0', '#0A6EA8'],
    article: ['#FFBA3F', '#FFD488'],
    module: ['#2EE1C1', '#7EF0D6'],
  };

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      onPress={onPress}
      style={[styles.pressable, dimensionStyle, style]}
    >
      <LinearGradient
        colors={gradients[variant as Exclude<ChipVariant, 'mood'>]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, dimensionStyle, isCompact && styles.gradientCompact]}>
        {content}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  compactDimensions: {
    minWidth: 36,
    height: 20,
  },
  gradient: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientCompact: {
    borderRadius: 12,
  },
  standardPadding: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compactPadding: {
  },
  label: {
    color: '#111111',
    fontSize: 10,
  },
  compactLabel: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  moodWrap: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWhite: {
    color: '#FFFFFF',
  },
});

export default Chip;
