import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export function Divider({ style }: DividerProps) {
  return (
    <LinearGradient
      colors={['#95DFFF', '#12A5E5']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[{ height: 2, borderRadius: 1, width: '100%' }, style]}
    />
  );
}
