import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

export type AlertVariant = 'video' | 'article' | 'module';

interface AlertProps {
  variant?: AlertVariant;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Alert({ variant = 'article', label, style }: AlertProps) {
  const gradients: Record<AlertVariant, readonly [string, string]> = {
    video: ['#2EA3E0', '#0A6EA8'],
    article: ['#FFBA3F', '#FFD488'],
    module: ['#2EE1C1', '#7EF0D6'],
  };

  const textWhiteFor: AlertVariant[] = ['video'];

  return (
    <LinearGradient
      colors={gradients[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.pill, style]}>
      <ThemedText type="defaultSemiBold" style={[styles.label, textWhiteFor.includes(variant) && styles.labelWhite]}>
        {label ?? variant.toUpperCase()}
      </ThemedText>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#111111',
    fontSize: 12,
  },
  labelWhite: {
    color: '#FFFFFF',
  },
});

export default Alert;
