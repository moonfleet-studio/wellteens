import * as React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';

interface WelcomeSplashContainerProps extends SvgProps {
  width?: number | string;
  height?: number | string;
}

export default function WelcomeSplashContainer({ width = '100%', height, ...props }: WelcomeSplashContainerProps) {
  const gradientId = React.useId();
  
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 393 556"
      preserveAspectRatio="xMinYMin slice"
      fill="none"
      {...props}
    >
      <Path
        d="M0 -9H393V491.651C393 491.651 339.5 556 196.5 556C53.5 556 0 491.651 0 491.651V-9Z"
        fill={`url(#${gradientId})`}
      />
      <Defs>
        <LinearGradient
          id={gradientId}
          x1={196.5}
          y1={-9}
          x2={196.5}
          y2={556}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#1590C6" />
          <Stop offset={0.725962} stopColor="#12A5E5" />
          <Stop offset={1} stopColor="#12A5E5" stopOpacity={0.77} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
