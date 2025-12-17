import { useCallback, useEffect, useMemo, useState } from 'react';

import { useMoodDrawer, type JournalEntry } from '@/components/mood-drawer-context';
import type { MoodHistoryPoint } from '@/components/ui/mood-history-card';
import { fetchJournalEntries, type JournalEntry as ApiJournalEntry } from '@/lib/api/journal';

function convertApiEntryToLegacy(apiEntry: ApiJournalEntry): JournalEntry {
  return {
    id: apiEntry.id.toString(),
    title: apiEntry.title,
    body: apiEntry.description,
    date: new Date(apiEntry.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.'),
    moodValue: apiEntry.mood.value,
    moodLabel: apiEntry.mood.name,
  };
}

function apiEntriesToMoodHistory(entries: ApiJournalEntry[]): MoodHistoryPoint[] {
  // First sort by createdAt timestamp (oldest to newest)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  return sortedEntries.map((entry) => ({
    date: entry.createdAt.split('T')[0], // Extract YYYY-MM-DD from ISO string
    value: entry.mood.value,
  }));
}

export function useMoodHistory() {
  const { journalEntries: localEntries, addJournalEntryChangeListener } = useMoodDrawer();
  const [apiEntries, setApiEntries] = useState<ApiJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchJournalEntries(1, 100);
      setApiEntries(response.docs);
    } catch (err) {
      console.error('Error loading mood history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  // Register refresh callback for mood history
  useEffect(() => {
    const unsubscribe = addJournalEntryChangeListener(loadEntries);
    return unsubscribe;
  }, [loadEntries, addJournalEntryChangeListener]);

  const allEntries = useMemo(() => {
    // Convert API entries to legacy format and merge with local entries
    const convertedApiEntries = apiEntries.map(convertApiEntryToLegacy);
    return localEntries ? [...localEntries, ...convertedApiEntries] : convertedApiEntries;
  }, [apiEntries, localEntries]);

  const moodHistory = useMemo(() => {
    if (apiEntries.length === 0 && !localEntries?.length) return [];
    return apiEntriesToMoodHistory(apiEntries);
  }, [apiEntries, localEntries]);

  return {
    allEntries,
    moodHistory,
    loading,
  };
}
