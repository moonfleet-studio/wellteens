import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';

export type ChipVariant = 'video' | 'article' | 'module' | 'mood';

interface ChipProps {
  variant?: ChipVariant;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Chip({ variant = 'article', label, onPress, style }: ChipProps) {
  const content = (
    <ThemedText type="defaultSemiBold" style={[styles.label, variant === 'video' && styles.labelWhite]}>
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
    article: ['#FFBA3F', '#FFD488'],
    module: ['#2EE1C1', '#7EF0D6'],
  };

  return (
    <Pressable accessibilityRole={onPress ? 'button' : 'text'} onPress={onPress} style={style}>
      <LinearGradient
        colors={gradients[variant as Exclude<ChipVariant, 'mood'>]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}>
        {content}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#111111',
    fontSize: 14,
  },
  moodWrap: {
    paddingVertical: 6,
    paddingHorizontal: 12,
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
