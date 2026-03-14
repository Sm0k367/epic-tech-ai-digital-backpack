/**
 * Client-side localStorage wrapper with type safety
 * Used for free-tier persistence (no backend required)
 */

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('localStorage write failed');
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn('localStorage remove failed');
  }
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.clear();
  } catch {
    console.warn('localStorage clear failed');
  }
}

// Storage keys
export const STORAGE_KEYS = {
  NOTES: 'epic_notes',
  TASKS: 'epic_tasks',
  FLASHCARDS: 'epic_flashcards',
  CHAT_HISTORY: 'epic_chat_history',
  CODE_SNIPPETS: 'epic_code_snippets',
  API_KEY: 'epic_api_key',
  SETTINGS: 'epic_settings',
  MUSIC_PLAYLIST: 'epic_music_playlist',
} as const;
