# Common Components

Document shared components here before creating new ones. List each entry as `ComponentName(props): short purpose`.

_Current components:_
 - Button(onPress: () => void, children: ReactNode, style?: StyleProp<ViewStyle>, variant?: 'primary' | 'secondary', disabled?: boolean): Gradient button built on Pressable with primary/secondary presets.
 - Input(label?: string, value?: string, onChangeText?: (text: string) => void, placeholder?: string, style?: ViewStyle): Text input with optional label and underline, supports controlled and uncontrolled usage.
 - Input(label?: string, value?: string, onChangeText?: (text: string) => void, placeholder?: string, style?: ViewStyle, variant?: 'default' | 'multiline' | 'outlined' | 'filled'): Text input with optional label and underline; supports controlled/uncontrolled usage and variants (multiline/outlined/filled).
 - Chip(label: string, variant?: 'video' | 'article' | 'module' | 'mood', onPress?: () => void, style?: ViewStyle): Small labeled tag/chip with gradient variants for content categories and an outlined mood variant.
