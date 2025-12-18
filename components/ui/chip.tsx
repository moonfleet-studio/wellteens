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

  const gradients: Record<Exclude<ChipVariant, 'mood'>, readonly [string, string]> = {
    video: ['#2EA3E0', '#0A6EA8'],
    videoCompact: ['#2EA3E0', '#0A6EA8'],
    article: ['#FFBA3F', '#FFD488'],
    module: ['#2EE1C1', '#7EF0D6'],
  };

  const chipLabel = (
    <ThemedText type="defaultSemiBold" style={[styles.label, isVideo && styles.labelWhite]}>
      {label}
    </ThemedText>
  );

  if (variant === 'mood') {
    return (
      <Pressable
        accessibilityRole={onPress ? 'button' : 'text'}
        onPress={onPress}
        style={[styles.moodWrap, style]}
      >
        {chipLabel}
      </Pressable>
    );
  }

  return (
    <Pressable accessibilityRole={onPress ? 'button' : 'text'} onPress={onPress} style={[styles.pressable, style]}>
      <LinearGradient
        colors={gradients[variant as Exclude<ChipVariant, 'mood'>]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {chipLabel}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  gradient: {
    minWidth: 40,
    height: 24,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#111111',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  moodWrap: {
    minWidth: 40,
    height: 24,
    paddingHorizontal: 12,
    borderRadius: 14,
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
