import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function PlayIcon({ size = 24, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5.18692 3.71487C5.42704 3.57009 5.72544 3.56159 5.97341 3.69247L20.3734 11.2925C20.6358 11.431 20.8 11.7033 20.8 12C20.8 12.2967 20.6358 12.569 20.3734 12.7075L5.97341 20.3075C5.72544 20.4384 5.42704 20.4299 5.18692 20.2851C4.9468 20.1403 4.8 19.8803 4.8 19.6V4.39998C4.8 4.11959 4.9468 3.85966 5.18692 3.71487ZM6.4 5.72678V18.2731L18.2861 12L6.4 5.72678Z" fill={color} />
    </Svg>
  );
}
