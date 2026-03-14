'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef, useCallback } from 'react';
import { AppShell } from '@/components/AppShell';
import { Gamepad2, Trophy, RotateCcw, Timer, Brain, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Typing Speed Test ────────────────────────────────────────────────────────
const TYPING_TEXTS = [
  'The quick brown fox jumps over the lazy dog near the riverbank.',
  'Programming is the art of telling another human what one wants the computer to do.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  'The best way to predict the future is to invent it with hard work and dedication.',
  'Code is like humor. When you have to explain it, it is bad.',
];

function TypingGame() {
  const [text] = useState(() => TYPING_TEXTS[Math.floor(Math.random() * TYPING_TEXTS.length)]);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setInput(''); setStarted(false); setFinished(false);
    setElapsed(0); setWpm(0); setAccuracy(100);
    if (timerRef.current) clearInterval(timerRef.current);
    inputRef.current?.focus();
  };

  const handleInput = (val: string) => {
    if (finished) return;
    if (!started && val.length > 0) {
      setStarted(true);
      const t = Date.now();
      setStartTime(t);
      timerRef.current = setInterval(() => setElapsed(Date.now() - t), 100);
    }
    setInput(val);
    // Accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
    }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);
    // Check done
    if (val === text) {
      if (timerRef.current) clearInterval(timerRef.current);
      const mins = (Date.now() - startTime) / 60000;
      setWpm(Math.round(text.split(' ').length / mins));
      setFinished(true);
    }
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-white/40">Time: <span className="text-white font-mono">{(elapsed / 1000).toFixed(1)}s</span></span>
        <span className="text-white/40">Accuracy: <span className={cn('font-mono', accuracy >= 95 ? 'text-green-400' : accuracy >= 80 ? 'text-yellow-400' : 'text-red-400')}>{accuracy}%</span></span>
        {wpm > 0 && <span className="text-white/40">WPM: <span className="text-cyan-400 font-mono font-bold">{wpm}</span></span>}
      </div>

      {/* Text display */}
      <div className="p-4 rounded-xl bg-[#0d1117] border border-white/08 font-mono text-base leading-relaxed select-none">
        {text.split('').map((char, i) => {
          let cls = 'text-white/30';
          if (i < input.length) cls = input[i] === char ? 'text-green-400' : 'text-red-400 bg-red-500/20';
          if (i === input.length) cls = 'text-white bg-cyan-500/30';
          return <span key={i} className={cls}>{char}</span>;
        })}
      </div>

      <input
        ref={inputRef}
        className="input-field font-mono"
        placeholder="Start typing..."
        value={input}
        onChange={e => handleInput(e.target.value)}
        disabled={finished}
        autoFocus
      />

      {finished && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 text-center">
          <Trophy size={24} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold text-lg">{wpm} WPM · {accuracy}% Accuracy</p>
          <p className="text-white/40 text-sm mt-1">
            {wpm >= 80 ? '🔥 Excellent!' : wpm >= 60 ? '👍 Great job!' : wpm >= 40 ? '💪 Keep practicing!' : '📚 Keep going!'}
          </p>
        </div>
      )}

      <button onClick={reset} className="btn-secondary flex items-center gap-2 text-sm">
        <RotateCcw size={14} /> Reset
      </button>
    </div>
  );
}

// ─── Memory Match ─────────────────────────────────────────────────────────────
const EMOJIS = ['🚀', '🎯', '💡', '🔥', '⚡', '🌟', '🎮', '🧠', '💎', '🎵', '🌈', '🦋'];

function MemoryGame() {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  const init = useCallback(() => {
    const pairs = EMOJIS.slice(0, 8);
    const deck = [...pairs, ...pairs]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
    setCards(deck);
    setSelected([]); setMoves(0); setMatches(0); setWon(false); setLocked(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  const flip = (id: number) => {
    if (locked || cards[id].flipped || cards[id].matched) return;
    const newCards = cards.map(c => c.id === id ? { ...c, flipped: true } : c);
    const newSelected = [...selected, id];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      if (newCards[a].emoji === newCards[b].emoji) {
        const matched = newCards.map(c => newSelected.includes(c.id) ? { ...c, matched: true } : c);
        setCards(matched);
        setSelected([]);
        setLocked(false);
        const newMatches = matches + 1;
        setMatches(newMatches);
        if (newMatches === 8) setWon(true);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => newSelected.includes(c.id) ? { ...c, flipped: false } : c));
          setSelected([]);
          setLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-white/40">Moves: <span className="text-white font-mono">{moves}</span></span>
        <span className="text-white/40">Matches: <span className="text-green-400 font-mono">{matches}/8</span></span>
      </div>
      <div className="grid grid-cols-4 gap-2 max-w-xs">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flip(card.id)}
            className={cn(
              'w-16 h-16 rounded-xl text-2xl transition-all duration-300 border',
              card.flipped || card.matched
                ? card.matched ? 'bg-green-500/20 border-green-500/30 scale-95' : 'bg-cyan-500/20 border-cyan-500/30'
                : 'bg-white/05 border-white/10 hover:bg-white/10 hover:border-white/20'
            )}
          >
            {(card.flipped || card.matched) ? card.emoji : '?'}
          </button>
        ))}
      </div>
      {won && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-center">
          <Trophy size={24} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-white font-bold">You won in {moves} moves!</p>
          <p className="text-white/40 text-sm">{moves <= 16 ? '🏆 Perfect memory!' : moves <= 24 ? '⭐ Great job!' : '👍 Well done!'}</p>
        </div>
      )}
      <button onClick={init} className="btn-secondary flex items-center gap-2 text-sm">
        <RotateCcw size={14} /> New Game
      </button>
    </div>
  );
}

// ─── Reaction Time ────────────────────────────────────────────────────────────
function ReactionGame() {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'done'>('idle');
  const [reactionTime, setReactionTime] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef(0);

  const start = () => {
    setState('waiting');
    const delay = 1500 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startRef.current = Date.now();
    }, delay);
  };

  const click = () => {
    if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('idle');
      return;
    }
    if (state === 'ready') {
      const rt = Date.now() - startRef.current;
      setReactionTime(rt);
      setScores(s => [...s.slice(-4), rt]);
      setBest(b => b === null ? rt : Math.min(b, rt));
      setState('done');
    }
  };

  const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm flex-wrap">
        {best && <span className="text-white/40">Best: <span className="text-yellow-400 font-mono">{best}ms</span></span>}
        {avg && <span className="text-white/40">Avg: <span className="text-cyan-400 font-mono">{avg}ms</span></span>}
        {scores.length > 0 && <span className="text-white/40">Rounds: <span className="text-white font-mono">{scores.length}</span></span>}
      </div>

      <button
        className={cn(
          'w-full h-40 rounded-2xl text-xl font-bold transition-all duration-200 border-2',
          state === 'idle' || state === 'done' ? 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30' :
          state === 'waiting' ? 'bg-red-500/20 border-red-500/30 text-red-400 cursor-pointer' :
          'bg-green-500/20 border-green-500/30 text-green-400 animate-pulse cursor-pointer'
        )}
        onClick={state === 'idle' || state === 'done' ? start : click}
      >
        {state === 'idle' ? '▶ Click to Start' :
         state === 'waiting' ? '⏳ Wait for green...' :
         state === 'ready' ? '🟢 CLICK NOW!' :
         `⚡ ${reactionTime}ms — Click to try again`}
      </button>

      {scores.length > 0 && (
        <div className="flex gap-2">
          {scores.map((s, i) => (
            <div key={i} className="flex-1 text-center p-2 rounded-lg bg-white/05 border border-white/08">
              <p className="text-xs text-white/40">#{i + 1}</p>
              <p className="text-sm font-mono text-white">{s}ms</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const GAMES = [
  { id: 'typing', label: 'Typing Speed', icon: Keyboard, description: 'Test your WPM and accuracy', component: TypingGame },
  { id: 'memory', label: 'Memory Match', icon: Brain, description: 'Match pairs to train memory', component: MemoryGame },
  { id: 'reaction', label: 'Reaction Time', icon: Timer, description: 'Test your reaction speed', component: ReactionGame },
];

export default function GameLabsPage() {
  const [activeGame, setActiveGame] = useState('typing');
  const ActiveComponent = GAMES.find(g => g.id === activeGame)?.component || TypingGame;

  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="text-orange-400" size={24} /> Game Labs
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Productivity mini-games to sharpen your skills</p>
          </div>
        </div>

        {/* Game selector */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {GAMES.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setActiveGame(id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
                activeGame === id
                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                  : 'bg-white/05 text-white/50 border-white/08 hover:bg-white/10 hover:text-white/80'
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Game area */}
        <div className="card">
          <div className="mb-4 pb-4 border-b border-white/08">
            <h2 className="font-semibold text-white">{GAMES.find(g => g.id === activeGame)?.label}</h2>
            <p className="text-xs text-white/40 mt-0.5">{GAMES.find(g => g.id === activeGame)?.description}</p>
          </div>
          <ActiveComponent />
        </div>
      </div>
    </AppShell>
  );
}
