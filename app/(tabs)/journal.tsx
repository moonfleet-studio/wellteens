import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TabScreen from '@/components/ui/tab-screen';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function Journal() {
  return (
    <TabScreen>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Journal (placeholder)</ThemedText>
      </ThemedView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
