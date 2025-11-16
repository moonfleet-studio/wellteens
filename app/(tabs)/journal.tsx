import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  MoodHistoryCard,
  MoodHistoryPoint,
} from '@/components/ui/mood-history-card';
import TabScreen from '@/components/ui/tab-screen';
import React from 'react';
import { StyleSheet } from 'react-native';

const mockMoodHistory: MoodHistoryPoint[] = [
  { date: '2025-01-02', value: 2 },
  { date: '2025-01-04', value: 1.5 },
  { date: '2025-01-06', value: 3 },
  { date: '2025-01-09', value: 2.2 },
  { date: '2025-01-12', value: 4 },
  { date: '2025-01-14', value: 4.6 },
];

export default function Journal() {
  return (
    <TabScreen>
      <ThemedView style={styles.container}>
        <MoodHistoryCard data={mockMoodHistory} />

        <ThemedText type="title" style={styles.sectionTitle}>
          Journal (placeholder)
        </ThemedText>
        <ThemedText style={styles.helperText}>
          This tab will soon show your reflections, prompts and entries. For now,
          we are focusing on the mood history component above.
        </ThemedText>
      </ThemedView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
  sectionTitle: {
    marginTop: 16,
  },
  helperText: {
    marginTop: 8,
    color: '#555',
  },
});
