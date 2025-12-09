import { useMoodDrawer } from '@/components/mood-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Alert, type AlertVariant } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import HalfIcon from '@/components/ui/icons/HalfIcom';
import { MoodHistoryCard } from '@/components/ui/mood-history-card';
import TabScreen from '@/components/ui/tab-screen';
import { useMoodHistory } from '@/lib/mood-history';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

function getMoodKey(value: number): AlertVariant {
  if (value <= 1) return 'awfull';
  if (value <= 2) return 'sad';
  if (value <= 3) return 'fine';
  if (value <= 4) return 'relaxed';
  return 'amazing';
}

export default function Journal() {
  const { openJournalEntry, openEditJournalEntry } = useMoodDrawer();
  const { allEntries, moodHistory } = useMoodHistory();

  const displayEntries = useMemo(() => {
    return allEntries.map((entry) => {
      const moodVariant = getMoodKey(entry.moodValue);
      return {
        id: entry.id,
        variant: moodVariant,
        chipLabel: entry.moodLabel.toUpperCase(),
        title: entry.title,
        date: entry.date,
        body: entry.body,
      };
    });
  }, [allEntries]);

  const handleEntryPress = (entryId: string) => {
    const entry = allEntries.find((e) => e.id === entryId);
    if (entry) {
      openEditJournalEntry(entry);
    }
  };

  return (
    <TabScreen headerContent={<MoodHistoryCard data={moodHistory} />} title="Journal">
        <ThemedView style={styles.buttonRowWrapper}>
          <ThemedView style={styles.buttonRow}>
            <View style={[styles.buttonColumn, styles.primaryColumnSpacing]}>
              <Button onPress={() => {}} variant="secondary" size="regular" block style={[styles.button, styles.secondaryButton]}>
                <ThemedText style={styles.buttonLabel}>Set Goal</ThemedText>
                <HalfIcon size={16} color="#1C1C1C" />
              </Button>
            </View>
            <View style={styles.buttonColumn}>
              <Button onPress={openJournalEntry} variant="primary" block style={[styles.button, styles.primaryButton]}>
                <ThemedText style={styles.buttonLabel}>Add Entry</ThemedText>
                <IconSymbol name="Plus" size={16} color="#1C1C1C" style={styles.iconSpacing} />
              </Button>
            </View>
          </ThemedView>
        </ThemedView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.entryList}>
          {displayEntries.map((entry) => (
            <Alert
              key={entry.id}
              variant={entry.variant}
              chipLabel={entry.chipLabel}
              title={entry.title}
              date={entry.date}
              body={entry.body}
              style={styles.entryCard}
              onPress={() => handleEntryPress(entry.id)}
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
