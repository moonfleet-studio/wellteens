import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FooterLogo from './icons/FooterLogo';

export default function Footer() {
  return (
    <View style={styles.container} accessibilityRole="contentinfo">
      <FooterLogo width={130} height={59} />

      <Text style={styles.caption}>
        EU Programme Erasmus+ KA2 Cooperation Partnership YOUTH
      </Text>
      <Text style={styles.caption}>
        Reference n. 2023-2-IT03-KA220-YOU-000176636
      </Text>

      <View style={styles.chip}>
        <Text style={styles.chipText}>Fundacja im. Mikołaja Reja</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  caption: {
    marginTop: 12,
    color: '#111',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  chip: {
    marginTop: 20,
    backgroundColor: 'rgba(242,242,242,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    // subtle shadow on native
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 18,
    color: '#111',
    fontWeight: '700',
  },
});
