// ─── Notes ───────────────────────────────────────────────────────────────────
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Tasks ───────────────────────────────────────────────────────────────────
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Flashcards ──────────────────────────────────────────────────────────────
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deck: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: string;
  reviewCount: number;
  createdAt: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  createdAt: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// ─── Code Snippets ────────────────────────────────────────────────────────────
export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Music ────────────────────────────────────────────────────────────────────
export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  genre: string;
  bpm?: number;
  key?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface ApiKeyInfo {
  key: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
  requestCount: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  tier: 'free' | 'api';
}
