import * as React from 'react';
import Svg, { Defs, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';

interface WelcomeSplashBgProps extends SvgProps {
  width?: number | string;
  height?: number | string;
}

export default function WelcomeSplashBg({ width = '100%', height, ...props }: WelcomeSplashBgProps) {
  const gradientId1 = React.useId();
  const gradientId2 = React.useId();
  
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 393 311"
      preserveAspectRatio="xMinYMin slice"
      fill="none"
      {...props}
    >
      <Path
        d="M209.268 1.3C222.22 3.9277 233.83 7.80699 244.994 14.9234C271.62 31.8887 285.234 59.7974 286.695 91.0152C288.477 129.146 288.575 168.444 273.71 203.986C272.812 206.129 266.044 220.768 265.114 220.985C264.184 221.201 253.347 217.911 251.513 217.269C241.711 213.842 230.875 207.302 223.19 200.33C221.893 199.15 219.194 197.211 219.849 195.428C227.193 182.264 233.437 165.095 234.38 149.925C235.455 132.567 235.54 106.677 234.354 89.377C231 40.6106 162.43 42.3078 159.089 87.7125C157.929 103.407 158.355 125.831 159.089 141.741C162.535 216.496 231.032 270.445 304.725 255.164C356.883 244.352 396.756 198.187 400.13 144.984V1.3H537.006V53.1069H452.477L452.504 140.653C450.78 199.734 419.13 254.437 368.872 284.96C255.136 354.034 112.409 273.715 106.735 142.835C105.981 125.398 105.726 102.863 106.735 85.5304C109.015 46.4033 137.718 12.6496 175.442 3.18067L184.195 1.3C184.195 1.3 190 0 197 0C204 0 209.281 1.3 209.281 1.3H209.268Z"
        fill={`url(#${gradientId1})`}
      />
      <Path
        d="M-6.12996 1.3L-6.15617 141.197C-3.53552 200.376 40.1638 248.893 98.9123 256.986C100.897 257.261 109.054 257.287 110.017 257.877C110.705 258.297 116.346 266.606 117.67 268.218C123.664 275.524 130.399 283.04 137.279 289.508C142.343 294.265 150.041 299.252 154.477 303.937C154.699 304.173 155.269 304.671 155.269 304.769C155.269 305.923 139.532 308.511 137.482 308.78C38.1001 321.99 -51.7162 247.117 -57.9533 147.737L-57.9271 53.1003H-143V1.3H-6.12996Z"
        fill={`url(#${gradientId2})`}
      />
      <Defs>
        <LinearGradient
          id={gradientId1}
          x1={321.539}
          y1={1.3}
          x2={321.539}
          y2={310.3}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="white" stopOpacity={0.5} />
        </LinearGradient>
        <LinearGradient
          id={gradientId2}
          x1={6.13469}
          y1={1.3}
          x2={6.13469}
          y2={310.294}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" />
          <Stop offset={1} stopColor="white" stopOpacity={0.5} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
