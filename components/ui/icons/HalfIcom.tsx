import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BASE_SIZE = 22;

interface HalfIconProps {
  size?: number;
  color?: string;
}

export default function HalfIcon({ size = BASE_SIZE, color = '#111' }: HalfIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5965 0C4.74423 0 0 4.74424 0 10.5965C0 16.4488 4.74423 21.1931 10.5965 21.1931C16.4488 21.1931 21.193 16.4488 21.193 10.5965C21.193 4.74424 16.4488 0 10.5965 0ZM10.5965 1.52C5.58369 1.52001 1.51999 5.58372 1.51999 10.5965C1.51999 15.6093 5.58369 19.673 10.5965 19.6731V1.52Z"
        fill={color}
      />
    </Svg>
  );
}
