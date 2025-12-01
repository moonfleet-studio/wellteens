import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Alert, type AlertVariant } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type ChipVariant } from '@/components/ui/chip';
import { IconSymbol } from '@/components/ui/icon-symbol';
import HalfIcon from '@/components/ui/icons/HalfIcom';
import {
  MoodHistoryCard,
  MoodHistoryPoint,
} from '@/components/ui/mood-history-card';
import TabScreen from '@/components/ui/tab-screen';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
    <TabScreen headerContent={<MoodHistoryCard data={mockMoodHistory} />} title="Journal">
        <ThemedView style={styles.buttonRowWrapper}>
          <ThemedView style={styles.buttonRow}>
            <View style={[styles.buttonColumn, styles.primaryColumnSpacing]}>
              <Button onPress={() => {}} variant="secondary" size="regular" block style={[styles.button, styles.secondaryButton]}>
                <ThemedText style={styles.buttonLabel}>Set Goal</ThemedText>
                <HalfIcon size={16} color="#1C1C1C" />
              </Button>
            </View>
            <View style={styles.buttonColumn}>
              <Button onPress={() => {}} variant="primary" block style={[styles.button, styles.primaryButton]}>
                <ThemedText style={styles.buttonLabel}>Add Entry</ThemedText>
                <IconSymbol name="Plus" size={16} color="#1C1C1C" style={styles.iconSpacing} />
              </Button>
            </View>
          </ThemedView>
        </ThemedView>
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
  buttonRowWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  container: {
    paddingHorizontal: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttonColumn: {
    flex: 1,
  },
  primaryColumnSpacing: {
    marginRight: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    marginRight: 10,
  },
  primaryButton: {
    flexDirection: 'row',
  },
  iconSpacing: {
    marginLeft: 6,
  },
  buttonLabel: {
    color: '#1C1C1C',
    fontWeight: '600',
  },
  entryList: {
    marginTop: 12,
  },
  entryCard: {
    marginBottom: 12,
  },
});
