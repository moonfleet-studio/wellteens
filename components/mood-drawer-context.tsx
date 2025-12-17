import React, { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { createJournalEntry, getMoodIdByValue, updateJournalEntry as updateJournalEntryApi } from '@/lib/api/journal';

export type MoodState = {
  key: string;
  label: string;
  value: number;
};

export const MOOD_STATES: MoodState[] = [
  { key: 'awfull', label: 'Awfull', value: 0 },
  { key: 'sad', label: 'Sad', value: 1 },
  { key: 'fine', label: 'Fine', value: 2 },
  { key: 'relaxed', label: 'Relaxed', value: 3 },
  { key: 'amazing', label: 'Amazing', value: 4 },
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
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => Promise<void>;
  editingEntry: JournalEntry | null;
  openEditJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (entry: JournalEntry) => Promise<void>;
  addJournalEntryChangeListener: (callback: () => void) => () => void;
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
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const listenersRef = useRef<Set<() => void>>(new Set());

  const openMoodDrawer = useCallback(() => {
    setMoodDrawerOpen(true);
  }, []);

  const closeMoodDrawer = useCallback(() => {
    setMoodDrawerOpen(false);
    setIsJournalMode(false);
  }, []);

  const addJournalEntryChangeListener = useCallback((callback: () => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const notifyListeners = useCallback(() => {
    listenersRef.current.forEach((callback) => callback());
  }, []);

  const openJournalEntry = useCallback(() => {
    setEditingEntry(null);
    setIsJournalMode(true);
    setSelectedMoodIndex(2);
    setMoodDrawerOpen(true);
  }, []);

  const openEditJournalEntry = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    const moodIndex = MOOD_STATES.findIndex((m) => m.value === entry.moodValue);
    setSelectedMoodIndex(moodIndex >= 0 ? moodIndex : 2);
    setIsJournalMode(true);
    setIsJournalFormOpen(true);
  }, []);

  const closeJournalEntry = useCallback(() => {
    setIsJournalFormOpen(false);
    setIsJournalMode(false);
    setSelectedMoodIndex(2);
    setEditingEntry(null);
  }, []);

  const confirmMoodSelection = useCallback(() => {
    setMoodDrawerOpen(false);
    setIsJournalFormOpen(true);
  }, []);

  const addJournalEntry = useCallback(async (entry: Omit<JournalEntry, 'id' | 'date'>) => {
    try {
      // Get mood ID from mood value
      const moodId = getMoodIdByValue(entry.moodValue);
      
      // Create journal entry via API
      const apiResponse = await createJournalEntry({
        title: entry.title,
        description: entry.body,
        mood: moodId,
      });

      // Handle PayloadCMS response which may wrap the document in 'doc'
      const doc = (apiResponse as any).doc || apiResponse;

      // Add to local state for immediate UI update
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).replace(/\//g, '.');

      const newEntry: JournalEntry = {
        ...entry,
        id: doc.id?.toString() || Date.now().toString(),
        date: dateStr,
      };

      setJournalEntries((prev) => [newEntry, ...prev]);
      setIsJournalFormOpen(false);
      setIsJournalMode(false);
      setSelectedMoodIndex(2);
      setEditingEntry(null);
      
      // Trigger refresh callback
      notifyListeners();
    } catch (error) {
      console.error('Error creating journal entry:', error);
      // Still close the form even if API fails
      setIsJournalFormOpen(false);
      setIsJournalMode(false);
      setSelectedMoodIndex(2);
      setEditingEntry(null);
    }
  }, [notifyListeners]);

  const updateJournalEntry = useCallback(async (updatedEntry: JournalEntry) => {
    try {
      // Get mood ID from mood value
      const moodId = getMoodIdByValue(updatedEntry.moodValue);
      
      // Update journal entry via API
      await updateJournalEntryApi(parseInt(updatedEntry.id), {
        title: updatedEntry.title,
        description: updatedEntry.body,
        mood: moodId,
      });

      // Update local state for immediate UI update
      setJournalEntries((prev) =>
        prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
      );
      setIsJournalFormOpen(false);
      setIsJournalMode(false);
      setSelectedMoodIndex(2);
      setEditingEntry(null);
      
      // Trigger refresh callback
      notifyListeners();
    } catch (error) {
      console.error('Error updating journal entry:', error);
      // Still close the form even if API fails
      setIsJournalFormOpen(false);
      setIsJournalMode(false);
      setSelectedMoodIndex(2);
      setEditingEntry(null);
    }
  }, [notifyListeners]);

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
      editingEntry,
      openEditJournalEntry,
      updateJournalEntry,
      addJournalEntryChangeListener,
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
      editingEntry,
      openEditJournalEntry,
      updateJournalEntry,
      addJournalEntryChangeListener,
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
