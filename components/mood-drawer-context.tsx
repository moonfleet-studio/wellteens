import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export type MoodState = {
  key: string;
  label: string;
  value: number;
};

export const MOOD_STATES: MoodState[] = [
  { key: 'awfull', label: 'Awfull', value: 1 },
  { key: 'sad', label: 'Sad', value: 2 },
  { key: 'fine', label: 'Fine', value: 3 },
  { key: 'relaxed', label: 'Relaxed', value: 4 },
  { key: 'amazing', label: 'Amazing', value: 5 },
];

export type JournalEntry = {
  id: string;
  title: string;
  body: string;
  date: string;
  moodValue: number;
  moodLabel: string;
};

type MoodDrawerContextValue = {
  isMoodDrawerOpen: boolean;
  openMoodDrawer: () => void;
  closeMoodDrawer: () => void;
  isJournalMode: boolean;
  selectedMoodIndex: number;
  setSelectedMoodIndex: (index: number) => void;
  openJournalEntry: () => void;
  closeJournalEntry: () => void;
  isJournalFormOpen: boolean;
  confirmMoodSelection: () => void;
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
};

const MoodDrawerContext = createContext<MoodDrawerContextValue | null>(null);

interface MoodDrawerProviderProps {
  children: ReactNode;
}

export function MoodDrawerProvider({ children }: MoodDrawerProviderProps) {
  const [isMoodDrawerOpen, setMoodDrawerOpen] = useState(false);
  const [isJournalMode, setIsJournalMode] = useState(false);
  const [isJournalFormOpen, setIsJournalFormOpen] = useState(false);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(2);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const openMoodDrawer = useCallback(() => {
    setMoodDrawerOpen(true);
  }, []);

  const closeMoodDrawer = useCallback(() => {
    setMoodDrawerOpen(false);
    setIsJournalMode(false);
  }, []);

  const openJournalEntry = useCallback(() => {
    setIsJournalMode(true);
    setSelectedMoodIndex(2);
    setMoodDrawerOpen(true);
  }, []);

  const closeJournalEntry = useCallback(() => {
    setIsJournalFormOpen(false);
    setIsJournalMode(false);
    setSelectedMoodIndex(2);
  }, []);

  const confirmMoodSelection = useCallback(() => {
    setMoodDrawerOpen(false);
    setIsJournalFormOpen(true);
  }, []);

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '.');

    const newEntry: JournalEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      date: dateStr,
    };

    setJournalEntries((prev) => [newEntry, ...prev]);
    setIsJournalFormOpen(false);
    setIsJournalMode(false);
    setSelectedMoodIndex(2);
  }, []);

  const contextValue = useMemo(
    () => ({
      isMoodDrawerOpen,
      openMoodDrawer,
      closeMoodDrawer,
      isJournalMode,
      selectedMoodIndex,
      setSelectedMoodIndex,
      openJournalEntry,
      closeJournalEntry,
      isJournalFormOpen,
      confirmMoodSelection,
      journalEntries,
      addJournalEntry,
    }),
    [
      isMoodDrawerOpen,
      openMoodDrawer,
      closeMoodDrawer,
      isJournalMode,
      selectedMoodIndex,
      openJournalEntry,
      closeJournalEntry,
      isJournalFormOpen,
      confirmMoodSelection,
      journalEntries,
      addJournalEntry,
    ]
  );

  return <MoodDrawerContext.Provider value={contextValue}>{children}</MoodDrawerContext.Provider>;
}

export function useMoodDrawer() {
  const context = useContext(MoodDrawerContext);
  if (!context) {
    throw new Error('useMoodDrawer must be used within a MoodDrawerProvider');
  }
  return context;
}
