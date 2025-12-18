import { apiFetch } from './client';
import type { Mood } from './modules';

/**
 * User structure from API (simplified for journal entries)
 */
export interface JournalUser {
  id: number;
  updatedAt: string;
  createdAt: string;
  email: string;
}

/**
 * Journal Entry from API
 */
export interface JournalEntry {
  id: number;
  title: string;
  description: string;
  mood: Mood;
  user: JournalUser;
  updatedAt: string;
  createdAt: string;
}

/**
 * Journal entries list response
 */
export interface JournalEntriesResponse {
  docs: JournalEntry[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

/**
 * Create journal entry payload
 */
export interface CreateJournalEntryPayload {
  title: string;
  description: string;
  mood: number; // Mood ID
}

/**
 * Fetch all journal entries for the current user
 */
export async function fetchJournalEntries(page: number = 1, limit: number = 100): Promise<JournalEntriesResponse> {
  return apiFetch<JournalEntriesResponse>(`/api/journal-entries?page=${page}&limit=${limit}&sort=-createdAt`);
}

/**
 * Fetch single journal entry by ID
 */
export async function fetchJournalEntryById(id: number): Promise<JournalEntry> {
  return apiFetch<JournalEntry>(`/api/journal-entries/${id}`);
}

/**
 * Create a new journal entry
 */
export async function createJournalEntry(payload: CreateJournalEntryPayload): Promise<JournalEntry> {
  return apiFetch<JournalEntry>('/api/journal-entries', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Update an existing journal entry
 */
export async function updateJournalEntry(id: number, payload: Partial<CreateJournalEntryPayload>): Promise<JournalEntry> {
  return apiFetch<JournalEntry>(`/api/journal-entries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(id: number): Promise<void> {
  return apiFetch<void>(`/api/journal-entries/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Moods list response
 */
export interface MoodsResponse {
  docs: Mood[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}

/**
 * Fetch all moods
 */
export async function fetchMoods(): Promise<MoodsResponse> {
  return apiFetch<MoodsResponse>('/api/moods');
}

/**
 * Get mood ID by value
 * Mood values mapping: 0=Awfull(id:1), 1=Sad(id:2), 2=Fine(id:3), 3=Relaxed(id:4), 4=Amazing(id:5)
 */
export function getMoodIdByValue(moodValue: number): number {
  // UI and API both use values 0-4
  // UI: 0=Awfull, 1=Sad, 2=Fine, 3=Relaxed, 4=Amazing
  // API: value 0=Awfull(id:1), 1=Sad(id:2), 2=Fine(id:3), 3=Relaxed(id:4), 4=Amazing(id:5)
  const mapping: Record<number, number> = {
    0: 1, // Awfull
    1: 2, // Sad
    2: 3, // Fine
    3: 4, // Relaxed
    4: 5, // Amazing
  };
  return mapping[moodValue] ?? 3; // Default to Fine (id:3)
}
