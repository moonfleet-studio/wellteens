import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type MoodDrawerContextValue = {
  isMoodDrawerOpen: boolean;
  openMoodDrawer: () => void;
  closeMoodDrawer: () => void;
};

const MoodDrawerContext = createContext<MoodDrawerContextValue | null>(null);

interface MoodDrawerProviderProps {
  children: ReactNode;
}

export function MoodDrawerProvider({ children }: MoodDrawerProviderProps) {
  const [isMoodDrawerOpen, setMoodDrawerOpen] = useState(false);

  const openMoodDrawer = useCallback(() => {
    setMoodDrawerOpen(true);
  }, []);

  const closeMoodDrawer = useCallback(() => {
    setMoodDrawerOpen(false);
  }, []);

  const contextValue = useMemo(
    () => ({ isMoodDrawerOpen, openMoodDrawer, closeMoodDrawer }),
    [isMoodDrawerOpen, openMoodDrawer, closeMoodDrawer]
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
