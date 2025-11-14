import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function PlusIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  // Use a simple stroke-based plus centered in a 24x24 viewBox.
  // Make the default stroke thinner to match the provided design (smaller strokeWidth).
  // For 24px icons this yields strokeWidth = 1.
  const strokeWidth = Math.max(1, Math.round(size * 0.04));
  const viewSize = 24;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${viewSize} ${viewSize}`} fill="none">
      <Path d="M12 5v14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
