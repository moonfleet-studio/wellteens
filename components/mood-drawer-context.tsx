import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { createJournalEntry, fetchMoods, getMoodIdByValue, updateJournalEntry as updateJournalEntryApi } from '@/lib/api/journal';

export type MoodState = {
  key: string;
  label: string;
  value: number;
  id: number;
  colors: readonly [string, string] | readonly [string, string, string];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

// Helper function to generate key from mood name
function getMoodKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to get mood colors and gradient config
function getMoodColorConfig(key: string): {
  colors: readonly [string, string] | readonly [string, string, string];
  start: { x: number; y: number };
  end: { x: number; y: number };
} {
  const configs: Record<string, { colors: readonly [string, string] | readonly [string, string, string]; start: { x: number; y: number }; end: { x: number; y: number } }> = {
    awfull: {
      colors: ['#FF7D7D', '#FF7979'] as const,
      start: { x: 1, y: 0.5 },
      end: { x: 0, y: 0.5 },
    },
    sad: {
      colors: ['#CCCCCC', 'rgba(144, 141, 133, 1)'] as const,
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 0.5 },
    },
    fine: {
      colors: ['#FFD07D', '#FFEECF'] as const,
      start: { x: 1, y: 0.5 },
      end: { x: 0, y: 0.5 },
    },
    relaxed: {
      colors: ['#12A5E5', '#2EB6F2', '#84DAFF'] as const,
      start: { x: 1, y: 0.5 },
      end: { x: 0, y: 0.5 },
    },
    amazing: {
      colors: ['#12E5C9', '#6DFDD9'] as const,
      start: { x: 1, y: 0.5 },
      end: { x: 0, y: 0.5 },
    },
  };

  return configs[key] || configs.fine;
}

// Fallback moods in case API fails
const FALLBACK_MOOD_STATES: MoodState[] = [
  { key: 'awfull', label: 'Awfull', value: 0, id: 1, ...getMoodColorConfig('awfull') },
  { key: 'sad', label: 'Sad', value: 1, id: 2, ...getMoodColorConfig('sad') },
  { key: 'fine', label: 'Fine', value: 2, id: 3, ...getMoodColorConfig('fine') },
  { key: 'relaxed', label: 'Relaxed', value: 3, id: 4, ...getMoodColorConfig('relaxed') },
  { key: 'amazing', label: 'Amazing', value: 4, id: 5, ...getMoodColorConfig('amazing') },
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
  moodStates: MoodState[];
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
  const [moodStates, setMoodStates] = useState<MoodState[]>(FALLBACK_MOOD_STATES);
  const listenersRef = useRef<Set<() => void>>(new Set());

  // Fetch moods from API on mount
  useEffect(() => {
    const loadMoods = async () => {
      try {
        const response = await fetchMoods();
        const apiMoods = response.docs
          .sort((a, b) => a.value - b.value) // Sort by value (0-4)
          .map((mood) => {
            const key = getMoodKey(mood.name);
            return {
              key,
              label: mood.name,
              value: mood.value,
              id: mood.id,
              ...getMoodColorConfig(key),
            };
          });
        setMoodStates(apiMoods);
      } catch {
        // Keep using fallback moods
      }
    };
    loadMoods();
  }, []);

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
    const moodIndex = moodStates.findIndex((m) => m.value === entry.moodValue);
    setSelectedMoodIndex(moodIndex >= 0 ? moodIndex : 2);
    setIsJournalMode(true);
    setIsJournalFormOpen(true);
  }, [moodStates]);

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
      moodStates,
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
      moodStates,
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
