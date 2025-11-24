import { ThemedView } from '@/components/themed-view';
import { Alert, type AlertVariant } from '@/components/ui/alert';
import { type ChipVariant } from '@/components/ui/chip';
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

const journalEntries: {
  id: string;
  variant: AlertVariant;
  chipLabel: string;
  chipVariant: ChipVariant;
  title: string;
  date: string;
  body: string;
}[] = [
  {
    id: 'review-mood',
    variant: 'module',
    chipLabel: 'MOOD',
    chipVariant: 'module',
    title: 'Mood check-in',
    date: '24.11.2025',
    body: 'Noticed a lot of energy in the afternoon, journaled how it felt and what triggered it.',
  },
  {
    id: 'breathing-break',
    variant: 'article',
    chipLabel: 'BREATHE',
    chipVariant: 'article',
    title: 'Breathing break',
    date: '23.11.2025',
    body: 'Tried a 4-4-6 cycle after school stress and felt calmer before dinner.',
  },
  {
    id: 'mentor-message',
    variant: 'video',
    chipLabel: 'HYPE',
    chipVariant: 'video',
    title: 'Mentor pep talk',
    date: '22.11.2025',
    body: 'Watched a quick video from my mentor when I felt overwhelmed and remembered my strengths.',
  },
];

export default function Journal() {
  return (
    <TabScreen animatedTopBar headerContent={<MoodHistoryCard data={mockMoodHistory} />} title="Journal">
      <ThemedView style={styles.container}>
    
        <ThemedView style={styles.entryList}>
          {journalEntries.map((entry) => (
            <Alert
              key={entry.id}
              variant={entry.variant}
              chipLabel={entry.chipLabel}
              chipVariant={entry.chipVariant}
              title={entry.title}
              date={entry.date}
              body={entry.body}
              style={styles.entryCard}
            />
          ))}
        </ThemedView>
      </ThemedView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 16,
    fontWeight: '600',
  },
  helperText: {
    marginTop: 8,
    color: '#555',
  },
  entryList: {
    marginTop: 12,
  },
  entryCard: {
    marginBottom: 12,
  },
});
