'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell } from '@/components/AppShell';
import { useToast } from '@/components/ui/Toast';
import { Send, MessageSquare, Trash2, Plus, Bot, User, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { generateId, cn } from '@/lib/utils';
import type { ChatMessage, ChatSession } from '@/types';

const SYSTEM_PROMPT = `You are Epic AI, a helpful, creative, and knowledgeable assistant built into the Epic Tech AI Digital Backpack. You help with studying, coding, writing, brainstorming, and general questions. Be concise but thorough. Use markdown formatting when helpful.`;

// Free tier: uses a simple echo/mock AI. With API key: calls real AI.
async function sendMessage(messages: ChatMessage[], apiKey?: string): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {}),
      },
      body: JSON.stringify({ messages: messages.map(m => ({ role: m.role, content: m.content })) }),
    });
    const data = await res.json();
    if (data.success) return data.data.content;
    return data.error || 'Something went wrong.';
  } catch {
    return 'Network error. Please try again.';
  }
}

export default function ChatNexusPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const saved = getItem<ChatSession[]>(STORAGE_KEYS.CHAT_HISTORY, []);
    setSessions(saved);
    if (saved.length > 0) setActiveId(saved[0].id);
    const savedKey = getItem<string>(STORAGE_KEYS.API_KEY, '');
    setApiKey(savedKey);
  }, []);

  const saveSessions = useCallback((updated: ChatSession[]) => {
    setSessions(updated);
    setItem(STORAGE_KEYS.CHAT_HISTORY, updated);
  }, []);

  const activeSession = sessions.find(s => s.id === activeId);

  const newSession = () => {
    const session: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [session, ...sessions];
    saveSessions(updated);
    setActiveId(session.id);
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    saveSessions(updated);
    if (activeId === id) setActiveId(updated[0]?.id || null);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!activeId) { newSession(); return; }

    const userMsg: ChatMessage = {
      id: generateId(), role: 'user', content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...(activeSession?.messages || []), userMsg];
    const title = activeSession?.messages.length === 0
      ? input.trim().slice(0, 40) + (input.length > 40 ? '...' : '')
      : activeSession?.title || 'Chat';

    const updatedSessions = sessions.map(s => s.id === activeId
      ? { ...s, messages: updatedMessages, title, updatedAt: new Date().toISOString() }
      : s
    );
    saveSessions(updatedSessions);
    setInput('');
    setLoading(true);

    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    const reply = await sendMessage(updatedMessages, apiKey || undefined);

    const assistantMsg: ChatMessage = {
      id: generateId(), role: 'assistant', content: reply,
      timestamp: new Date().toISOString(), model: apiKey ? 'gpt-4o-mini' : 'epic-free',
    };

    const finalSessions = updatedSessions.map(s => s.id === activeId
      ? { ...s, messages: [...updatedMessages, assistantMsg], updatedAt: new Date().toISOString() }
      : s
    );
    saveSessions(finalSessions);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast('Copied to clipboard', 'success');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppShell>
      <div className="flex h-screen overflow-hidden">
        {/* Sessions sidebar */}
        <div className="w-56 flex-shrink-0 border-r border-white/08 bg-[#0a0a0f] flex flex-col">
          <div className="p-3 border-b border-white/08">
            <button onClick={newSession} className="w-full btn-primary flex items-center justify-center gap-2 text-xs py-2">
              <Plus size={14} /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
            {sessions.length === 0 && (
              <p className="text-xs text-white/20 text-center py-4">No chats yet</p>
            )}
            {sessions.map(s => (
              <div
                key={s.id}
                className={cn(
                  'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs',
                  activeId === s.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-white/50 hover:bg-white/05 hover:text-white/80'
                )}
                onClick={() => setActiveId(s.id)}
              >
                <MessageSquare size={12} className="flex-shrink-0" />
                <span className="flex-1 truncate">{s.title}</span>
                <button
                  onClick={e => { e.stopPropagation(); deleteSession(s.id); }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 transition-all"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
          {/* API Key input */}
          <div className="p-3 border-t border-white/08">
            <p className="text-[10px] text-white/30 mb-1.5 flex items-center gap-1">
              <Sparkles size={10} /> API Key (optional)
            </p>
            <input
              type="password"
              className="input-field text-xs py-1.5"
              placeholder="epic_xxxx for AI replies"
              value={apiKey}
              onChange={e => {
                setApiKey(e.target.value);
                setItem(STORAGE_KEYS.API_KEY, e.target.value);
              }}
            />
            <p className="text-[9px] text-white/20 mt-1">Without key: smart responses. With key: full AI.</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center">
                <Bot size={32} className="text-cyan-400" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-2">Epic AI Assistant</h2>
                <p className="text-white/40 text-sm max-w-sm">Start a new chat to ask questions, get help with code, study topics, or brainstorm ideas.</p>
              </div>
              <button onClick={newSession} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Start New Chat
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeSession.messages.length === 0 && (
                  <div className="text-center py-12">
                    <Bot size={40} className="text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">Send a message to start the conversation</p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      {['Explain quantum computing', 'Help me debug my code', 'Create a study plan', 'Write a poem'].map(s => (
                        <button key={s} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 rounded-lg bg-white/05 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all border border-white/08">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {activeSession.messages.map(msg => (
                  <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={14} className="text-cyan-400" />
                      </div>
                    )}
                    <div className={cn(
                      'group relative max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-cyan-500/15 text-white border border-cyan-500/20 rounded-tr-sm'
                        : 'bg-[#0d1117] text-white/90 border border-white/08 rounded-tl-sm'
                    )}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <button
                        onClick={() => copyMessage(msg.id, msg.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-all"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User size={14} className="text-white/60" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-cyan-400" />
                    </div>
                    <div className="bg-[#0d1117] border border-white/08 rounded-2xl rounded-tl-sm px-4 py-3">
                      <Loader2 size={16} className="text-cyan-400 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/08">
                <div className="flex gap-3 items-end">
                  <textarea
                    ref={inputRef}
                    className="input-field flex-1 resize-none min-h-[44px] max-h-[120px] py-3"
                    placeholder="Ask anything... (Enter to send, Shift+Enter for newline)"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className={cn(
                      'p-3 rounded-xl transition-all flex-shrink-0',
                      input.trim() && !loading
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black'
                        : 'bg-white/05 text-white/20 cursor-not-allowed'
                    )}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
