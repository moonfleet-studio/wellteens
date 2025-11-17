# Common Components

Document shared components here before creating new ones. List each entry as `ComponentName(props): short purpose`.

_Current components:_
 - Button(onPress: () => void, children: ReactNode, style?: StyleProp<ViewStyle>, variant?: 'primary' | 'secondary', disabled?: boolean): Gradient button built on Pressable with primary/secondary presets.
 - Input(label?: string, value?: string, onChangeText?: (text: string) => void, placeholder?: string, style?: ViewStyle): Text input with optional label and underline, supports controlled and uncontrolled usage.
 - Input(label?: string, value?: string, onChangeText?: (text: string) => void, placeholder?: string, style?: ViewStyle, variant?: 'default' | 'multiline' | 'outlined' | 'filled'): Text input with optional label and underline; supports controlled/uncontrolled usage and variants (multiline/outlined/filled).
 - Chip(label: string, variant?: 'video' | 'article' | 'module' | 'mood', onPress?: () => void, style?: ViewStyle): Small labeled tag/chip with gradient variants for content categories and an outlined mood variant.
 - Alert(label?: string, variant?: 'video' | 'article' | 'module', style?: ViewStyle): Small pill used inside Card to indicate content type; gradient variants.
 - Card(image: ImageSourcePropType, title: string, description?: string, alertVariant?: 'video'|'article'|'module', alertLabel?: string): Image-based card with overlay content and an Alert badge.

 - IconSymbol(name: string, size?: number, color?: string, style?: StyleProp<TextStyle>): Unified icon provider that returns branded TSX icon components from `components/ui/icons/*` (Logo, Pencil2, Play, Reader, Plus) and falls back to MaterialIcons for unknown names. Use this instead of importing SVGs directly.

 - icons/*: Folder `components/ui/icons/` contains the TSX React Native SVG components for branded icons (Logo.tsx, Pencil2.tsx, Play.tsx, Reader.tsx, Plus.tsx, Profile.tsx). Prefer these components to raw .svg imports to avoid bundler/transform issues across platforms.

 - NavigationTopBar(children?: ReactNode, includeSafeAreaInset?: boolean, style?: StyleProp<ViewStyle>, contentContainerStyle?: StyleProp<ViewStyle>): Curved, gradient navigation header that mirrors the design SVG while accounting for safe-area insets and accepting custom slot content.

Example usage:

```tsx
import { IconSymbol } from '@/components/ui/icon-symbol';

// in render
<IconSymbol name="Play" size={28} color="#333" />
```
