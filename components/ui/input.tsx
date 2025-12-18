import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputContentSizeChangeEventData, TextInputProps, View, ViewStyle } from 'react-native';

type InputVariant = 'default' | 'multiline' | 'outlined' | 'filled' | 'search';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  placeholder?: string;
  variant?: InputVariant;
  numberOfLines?: number;
}

export function Input({
  label,
  value,
  onChangeText,
  style,
  placeholder,
  variant = 'default',
  numberOfLines = 4,
  multiline,
  ...rest
}: InputProps) {
  const [internal, setInternal] = useState('');
  const [height, setHeight] = useState<number | undefined>(undefined);
  const isControlled = typeof value !== 'undefined';

  const current = isControlled ? value! : internal;

  const isMultiline = variant === 'multiline' || multiline === true;
  const isSearch = variant === 'search';

  function handleContentSizeChange(e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) {
    if (!isMultiline) return;
    const h = Math.max(40, e.nativeEvent.contentSize.height);
    setHeight(h);
  }

  const inputElement = (
    <TextInput
      style={[
        styles.input,
        variant === 'outlined' && styles.outlined,
        variant === 'filled' && styles.filled,
        isSearch && styles.searchInput,
        isMultiline && { height },
      ]}
      value={current}
      onChangeText={(t) => {
        if (!isControlled) setInternal(t);
        onChangeText?.(t);
      }}
      placeholder={placeholder}
      placeholderTextColor="rgba(0,0,0,0.4)"
      multiline={isMultiline}
      numberOfLines={isMultiline ? numberOfLines : undefined}
      textAlignVertical={isMultiline ? 'top' : 'center'}
      onContentSizeChange={handleContentSizeChange}
      {...rest}
    />
  );

  return (
    <View style={[styles.container, style as any]}>
      {label ? <ThemedText style={styles.label}>{label}</ThemedText> : null}
      {isSearch ? (
        <View style={styles.searchWrapper}>
          <IconSymbol name="search" size={20} color="#7B7B7B" />
          {inputElement}
        </View>
      ) : (
        inputElement
      )}
      {variant === 'default' && <View style={styles.underline} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
    color: '#1C1C1C',
  },
  input: {
    minHeight: 40,
    paddingVertical: 4,
    paddingHorizontal: 0,
    color: '#1C1C1C',
    fontSize: 16,
  },
  underline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 6,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  filled: {
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 24,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 8,
    fontSize: 16,
  },
});
