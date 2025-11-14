// Shared icon component that prefers branded SVG/TSX icons and falls back to MaterialIcons.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

import LogoIcon from './icons/Logo';
import Pencil2Icon from './icons/Pencil2';
import PlayIcon from './icons/Play';
import PlusIcon from './icons/Plus';
import ReaderIcon from './icons/Reader';

type IconName = 'Logo' | 'Pencil2' | 'Play' | 'Reader' | 'Plus';
type IconComponent = React.ComponentType<{ size?: number; color?: string }>;

const BRAND_ICONS: Record<IconName, IconComponent> = {
  Logo: LogoIcon,
  Pencil2: Pencil2Icon,
  Play: PlayIcon,
  Reader: ReaderIcon,
  Plus: PlusIcon,
};

export function IconSymbol({
  name,
  size = 24,
  color = '#000',
  style,
}: {
  name: IconName | string;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const maybeIcon = BRAND_ICONS[name as IconName];

  if (maybeIcon) {
    const IconComponent = maybeIcon;
    const safeColor = typeof color === 'string' ? color : undefined;
    return <IconComponent size={size} color={safeColor} />;
  }

  return <MaterialIcons color={color} size={size} name={String(name) as any} style={style} />;
}

export default IconSymbol;
