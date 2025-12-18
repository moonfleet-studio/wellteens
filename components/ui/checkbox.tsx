import { ThemedText } from '@/components/themed-text';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';

interface CheckboxProps {
  label: string;
  checked?: boolean; // controlled
  defaultChecked?: boolean; // uncontrolled
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export function Checkbox({ label, checked, defaultChecked = false, onChange, disabled = false, style, labelStyle }: CheckboxProps) {
  const isControlled = typeof checked === 'boolean';
  const [internal, setInternal] = useState<boolean>(defaultChecked);
  const value = isControlled ? (checked as boolean) : internal;

  useEffect(() => {
    // if switching from uncontrolled->controlled, keep value in sync
    if (isControlled) return;
  }, [isControlled]);

  const toggle = () => {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <Pressable
      onPress={toggle}
      style={[styles.container, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value, disabled }}>
      <View style={[styles.box, value && styles.boxChecked, disabled && styles.boxDisabled]}>
        {value ? <ThemedText type="defaultSemiBold" style={styles.check}>✓</ThemedText> : null}
      </View>
      <ThemedText type="default" style={[styles.label, labelStyle]}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // top-align the checkbox with the text
    alignItems: 'flex-start',
  },
  box: {
    width: 18,
    height: 18,
    aspectRatio: 1,
    flexShrink: 0,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: 'transparent',
    marginTop: 6,
  alignItems: 'center',
  justifyContent: 'center',
  },
  boxChecked: {
    // use the same warm/gold tint as primary buttons for checked state
    backgroundColor: '#FFD07D',
    borderColor: 'transparent',
  },
  boxDisabled: {
    opacity: 0.5,
  },
  check: {
    color: '#111111',
    fontSize: 12,
    lineHeight: 12,
  },
  label: {
    marginLeft: 12,
    fontSize: 12,
    lineHeight: 18,
    flexShrink: 1,
  },
});

export default Checkbox;
