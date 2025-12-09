import { useMemo } from 'react';

import { useMoodDrawer, type JournalEntry } from '@/components/mood-drawer-context';
import type { MoodHistoryPoint } from '@/components/ui/mood-history-card';

// Static mock entries - will be replaced with API data later
const STATIC_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'review-mood',
    title: 'Mood check-in',
    body: 'Noticed a lot of energy in the afternoon, journaled how it felt and what triggered it.',
    date: '24.11.2025',
    moodValue: 3,
    moodLabel: 'Fine',
  },
  {
    id: 'breathing-break',
    title: 'Breathing break',
    body: 'Tried a 4-4-6 cycle after school stress and felt calmer before dinner.',
    date: '23.11.2025',
    moodValue: 4,
    moodLabel: 'Relaxed',
  },
  {
    id: 'mentor-message',
    title: 'Mentor pep talk',
    body: 'Watched a quick video from my mentor when I felt overwhelmed and remembered my strengths.',
    date: '22.11.2025',
    moodValue: 5,
    moodLabel: 'Amazing',
  },
];

// Fallback mock data when no entries exist
const FALLBACK_MOOD_HISTORY: MoodHistoryPoint[] = [
  { date: '2025-01-02', value: 2 },
  { date: '2025-01-04', value: 1.5 },
  { date: '2025-01-06', value: 3 },
  { date: '2025-01-09', value: 2.2 },
  { date: '2025-01-12', value: 4 },
  { date: '2025-01-14', value: 4.6 },
];

function convertDateToISO(date: string): string {
  // Convert from DD.MM.YYYY to YYYY-MM-DD
  return date.split('.').reverse().join('-');
}

function entriesToMoodHistory(entries: JournalEntry[]): MoodHistoryPoint[] {
  return entries
    .map((entry) => ({
      date: convertDateToISO(entry.date),
      value: entry.moodValue,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function useMoodHistory() {
  const { journalEntries } = useMoodDrawer();

  const allEntries = useMemo(() => {
    return journalEntries ? [...journalEntries, ...STATIC_JOURNAL_ENTRIES] : STATIC_JOURNAL_ENTRIES;
  }, [journalEntries]);

  const moodHistory = useMemo(() => {
    if (allEntries.length === 0) return FALLBACK_MOOD_HISTORY;
    return entriesToMoodHistory(allEntries);
  }, [allEntries]);

  return {
    allEntries,
    moodHistory,
    staticEntries: STATIC_JOURNAL_ENTRIES,
  };
}

export { FALLBACK_MOOD_HISTORY, STATIC_JOURNAL_ENTRIES };

