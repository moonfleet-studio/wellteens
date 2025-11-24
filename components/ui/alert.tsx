import { ThemedText } from '@/components/themed-text';
import { Chip, type ChipVariant } from '@/components/ui/chip';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type AlertVariant = 'video' | 'article' | 'module';

interface AlertProps {
  variant?: AlertVariant;
  title: string;
  date: string;
  body: string;
  chipLabel?: string;
  chipVariant?: ChipVariant;
  style?: StyleProp<ViewStyle>;
}

export function Alert({ variant = 'article', title, date, body, chipLabel, chipVariant, style }: AlertProps) {
  const gradients: Record<AlertVariant, readonly [string, string]> = {
    module: ['#6DFDD9', '#12E5C9'],
    article: ['#FFEECF', '#FFD07D'],
    video: ['#FF96B4', '#FF5E5E'],
  };

  const overlayGradient = ['#FFFFFF', 'rgba(255, 255, 255, 0.5)'] as const;
  const chipVariantValue = chipVariant ?? variant;

  return (
    <LinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.root, style]}
    >
      <View style={styles.overlayWrapper}>
        <LinearGradient colors={overlayGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.overlay}>
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.inner}>
            <Chip label={chipLabel ?? variant.toUpperCase()} variant={chipVariantValue} style={styles.chip} />
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText style={styles.date}>{date}</ThemedText>
            <ThemedText style={styles.body}>{body}</ThemedText>
          </View>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 24,
    padding: 4,
    width: '100%',
  },
  overlayWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  overlay: {
    padding: 16,
  },
  inner: {
    gap: 6,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  date: {
    fontSize: 14,
    color: '#1C1C1C',
  },
  body: {
    fontSize: 16,
    color: '#1C1C1C',
  },
});

export default Alert;
