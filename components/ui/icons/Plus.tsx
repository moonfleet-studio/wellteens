import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function PlusIcon({ size = 30, color = '#000' }: { size?: number; color?: string }) {
  // Use a simple stroke-based plus centered in a 24x24 viewBox.
  // Make the default stroke thicker for better visibility at 30px size.
  const strokeWidth = 2;
  const viewSize = 30;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${viewSize} ${viewSize}`} fill="none">
      <Path d="M15 6v18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 15h18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
