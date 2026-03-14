'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/AppShell';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Plus, Brain, Trash2, Edit3, RotateCcw, ChevronLeft, ChevronRight, BookOpen, X } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { generateId, cn } from '@/lib/utils';
import type { Flashcard } from '@/types';

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<string[]>([]);
  const [activeDeck, setActiveDeck] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCard, setEditCard] = useState<Flashcard | null>(null);
  const [form, setForm] = useState({ front: '', back: '', deck: '', difficulty: 'medium' as Flashcard['difficulty'] });
  const { toast } = useToast();

  useEffect(() => {
    const saved = getItem<Flashcard[]>(STORAGE_KEYS.FLASHCARDS, []);
    setCards(saved);
    const uniqueDecks = [...new Set(saved.map(c => c.deck).filter(Boolean))];
    setDecks(uniqueDecks);
  }, []);

  const save = useCallback((updated: Flashcard[]) => {
    setCards(updated);
    setItem(STORAGE_KEYS.FLASHCARDS, updated);
    const uniqueDecks = [...new Set(updated.map(c => c.deck).filter(Boolean))];
    setDecks(uniqueDecks);
  }, []);

  const openNew = () => {
    setEditCard(null);
    setForm({ front: '', back: '', deck: activeDeck || '', difficulty: 'medium' });
    setModalOpen(true);
  };

  const openEdit = (card: Flashcard) => {
    setEditCard(card);
    setForm({ front: card.front, back: card.back, deck: card.deck, difficulty: card.difficulty });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (!form.front.trim() || !form.back.trim()) { toast('Front and back are required', 'error'); return; }
    const now = new Date().toISOString();
    if (editCard) {
      save(cards.map(c => c.id === editCard.id ? { ...c, ...form } : c));
      toast('Card updated', 'success');
    } else {
      const card: Flashcard = {
        id: generateId(), ...form,
        nextReview: now, reviewCount: 0, createdAt: now,
      };
      save([card, ...cards]);
      toast('Card created', 'success');
    }
    setModalOpen(false);
  };

  const deleteCard = (id: string) => {
    save(cards.filter(c => c.id !== id));
    toast('Card deleted', 'info');
  };

  const deckCards = activeDeck ? cards.filter(c => c.deck === activeDeck) : cards;
  const studyCards = deckCards;

  const startStudy = () => {
    if (studyCards.length === 0) { toast('No cards to study', 'warning'); return; }
    setStudyIndex(0);
    setFlipped(false);
    setStudyMode(true);
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setStudyIndex(i => (i + 1) % studyCards.length), 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setStudyIndex(i => (i - 1 + studyCards.length) % studyCards.length), 150);
  };

  const diffColor: Record<Flashcard['difficulty'], string> = {
    easy: 'bg-green-500/10 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Brain className="text-purple-400" size={24} /> Flashcards
            </h1>
            <p className="text-sm text-white/40 mt-0.5">{cards.length} cards · {decks.length} decks</p>
          </div>
          <div className="flex gap-2">
            <button onClick={startStudy} className="btn-secondary flex items-center gap-2">
              <BookOpen size={16} /> Study
            </button>
            <button onClick={openNew} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> New Card
            </button>
          </div>
        </div>

        {/* Study Mode */}
        {studyMode && studyCards.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white/60">Study Mode — {activeDeck || 'All Decks'}</h2>
              <button onClick={() => setStudyMode(false)} className="text-white/40 hover:text-white/70 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button onClick={prevCard} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors">
                <ChevronLeft size={24} />
              </button>
              {/* Flashcard */}
              <div
                className="relative w-full max-w-lg h-56 cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => setFlipped(f => !f)}
              >
                <div className={cn(
                  'absolute inset-0 rounded-2xl transition-all duration-500',
                  'flex flex-col items-center justify-center p-8 text-center',
                  'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20',
                  flipped && 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20'
                )}>
                  <div className="text-xs text-white/30 mb-3 uppercase tracking-wider">
                    {flipped ? 'Answer' : 'Question'} · {studyIndex + 1}/{studyCards.length}
                  </div>
                  <p className="text-lg font-semibold text-white leading-relaxed">
                    {flipped ? studyCards[studyIndex].back : studyCards[studyIndex].front}
                  </p>
                  <div className="mt-4 text-xs text-white/30">
                    {flipped ? 'Click to see question' : 'Click to reveal answer'}
                  </div>
                </div>
              </div>
              <button onClick={nextCard} className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Deck filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActiveDeck(null)}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', !activeDeck ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/05 text-white/50 hover:bg-white/10')}
          >
            All ({cards.length})
          </button>
          {decks.map(deck => (
            <button
              key={deck}
              onClick={() => setActiveDeck(deck)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', activeDeck === deck ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/05 text-white/50 hover:bg-white/10')}
            >
              {deck} ({cards.filter(c => c.deck === deck).length})
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {deckCards.length === 0 ? (
          <div className="text-center py-20">
            <Brain size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg font-medium">No flashcards yet</p>
            <p className="text-white/20 text-sm mt-1">Create cards to start studying</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deckCards.map(card => (
              <div key={card.id} className="group card hover:border-purple-500/20">
                <div className="flex items-start justify-between mb-2">
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-medium', diffColor[card.difficulty])}>
                    {card.difficulty}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(card)} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
                      <Edit3 size={12} />
                    </button>
                    <button onClick={() => deleteCard(card.id)} className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-white/40 mb-0.5">Front</p>
                  <p className="text-sm text-white font-medium line-clamp-2">{card.front}</p>
                </div>
                <div className="border-t border-white/08 pt-2">
                  <p className="text-xs text-white/40 mb-0.5">Back</p>
                  <p className="text-sm text-white/60 line-clamp-2">{card.back}</p>
                </div>
                {card.deck && <p className="text-[10px] text-purple-400/60 mt-2">{card.deck}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCard ? 'Edit Card' : 'New Flashcard'} size="md">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Front (Question)</label>
              <textarea className="input-field min-h-[80px] resize-none" placeholder="What is the question?" value={form.front} onChange={e => setForm(f => ({ ...f, front: e.target.value }))} autoFocus />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Back (Answer)</label>
              <textarea className="input-field min-h-[80px] resize-none" placeholder="What is the answer?" value={form.back} onChange={e => setForm(f => ({ ...f, back: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Deck</label>
                <input className="input-field" placeholder="e.g. Biology, Math..." value={form.deck} onChange={e => setForm(f => ({ ...f, deck: e.target.value }))} list="deck-list" />
                <datalist id="deck-list">{decks.map(d => <option key={d} value={d} />)}</datalist>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Difficulty</label>
                <select className="input-field" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Flashcard['difficulty'] }))}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSubmit} className="btn-primary flex-1">{editCard ? 'Save Changes' : 'Create Card'}</button>
              <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
