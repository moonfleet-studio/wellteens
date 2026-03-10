import { useMoodDrawer } from '@/components/mood-drawer-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Alert, type AlertVariant } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import HalfIcon from '@/components/ui/icons/HalfIcom';
import { MoodHistoryCard } from '@/components/ui/mood-history-card';
import TabScreen from '@/components/ui/tab-screen';
import { fetchJournalEntries, type JournalEntry } from '@/lib/api/journal';
import { useMoodHistory } from '@/lib/mood-history';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

function getMoodKey(value: number): AlertVariant {
  if (value === 0) return 'awfull';
  if (value === 1) return 'sad';
  if (value === 2) return 'fine';
  if (value === 3) return 'relaxed';
  return 'amazing';
}

export default function Journal() {
  const { openJournalEntry, openEditJournalEntry, addJournalEntryChangeListener } = useMoodDrawer();
  const { moodHistory } = useMoodHistory();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJournalEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchJournalEntries(1, 100);
      setJournalEntries(response.docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load journal entries');
      console.error('Error loading journal entries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJournalEntries();
  }, [loadJournalEntries]);

  // Register refresh callback
  useEffect(() => {
    const unsubscribe = addJournalEntryChangeListener(loadJournalEntries);
    return unsubscribe;
  }, [addJournalEntryChangeListener, loadJournalEntries]);

  const displayEntries = useMemo(() => {
    return journalEntries.map((entry) => {
      const moodVariant = entry.mood ? getMoodKey(entry.mood.value) : 'fine';
      return {
        id: entry.id.toString(),
        variant: moodVariant,
        chipLabel: entry.mood ? entry.mood.name.toUpperCase() : 'UNKNOWN',
        title: entry.title || 'Untitled',
        date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '',
        body: entry.description || '',
      };
    });
  }, [journalEntries]);

  const handleEntryPress = (entryId: string) => {
    const entry = journalEntries.find((e) => e.id.toString() === entryId);
    if (entry) {
      // Convert API entry to legacy format for the drawer
      openEditJournalEntry({
        id: entry.id.toString(),
        title: entry.title || 'Untitled',
        body: entry.description || '',
        moodValue: entry.mood?.value ?? 2,
        moodLabel: entry.mood?.name ?? 'Fine',
        date: entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : '',
      });
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
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#FFD07D" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        ) : (
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
        )}
      </ThemedView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  buttonRowWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
});
