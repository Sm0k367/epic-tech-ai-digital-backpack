'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/AppShell';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, Shuffle, Repeat, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  mood: string;
  url: string;
  color: string;
}

// Curated free/public domain tracks via YouTube embeds + free streaming sources
const TRACKS: Track[] = [
  { id: '1', title: 'Lofi Study Beats', artist: 'ChilledCow', genre: 'Lo-Fi', bpm: 75, mood: 'Focus', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', color: 'from-purple-500/20 to-blue-500/20' },
  { id: '2', title: 'Deep Focus Flow', artist: 'Ambient Works', genre: 'Ambient', bpm: 60, mood: 'Deep Work', url: 'https://www.youtube.com/watch?v=5qap5aO4i9A', color: 'from-blue-500/20 to-cyan-500/20' },
  { id: '3', title: 'Jazz Cafe Vibes', artist: 'Jazz Hop', genre: 'Jazz Hop', bpm: 85, mood: 'Creative', url: 'https://www.youtube.com/watch?v=Dx5qFachd3A', color: 'from-orange-500/20 to-yellow-500/20' },
  { id: '4', title: 'Synthwave Drive', artist: 'Neon Nights', genre: 'Synthwave', bpm: 110, mood: 'Energized', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY', color: 'from-pink-500/20 to-purple-500/20' },
  { id: '5', title: 'Nature Sounds', artist: 'Earth Sounds', genre: 'Nature', bpm: 0, mood: 'Calm', url: 'https://www.youtube.com/watch?v=eKFTSSKCzWA', color: 'from-green-500/20 to-teal-500/20' },
  { id: '6', title: 'Classical Focus', artist: 'Mozart', genre: 'Classical', bpm: 120, mood: 'Study', url: 'https://www.youtube.com/watch?v=Rb0UmrCXxVA', color: 'from-yellow-500/20 to-orange-500/20' },
  { id: '7', title: 'Coding Beats', artist: 'Dev Music', genre: 'Electronic', bpm: 128, mood: 'Coding', url: 'https://www.youtube.com/watch?v=n61ULEU7CO0', color: 'from-cyan-500/20 to-green-500/20' },
  { id: '8', title: 'Rain & Piano', artist: 'Relaxing Piano', genre: 'Piano', bpm: 55, mood: 'Relaxed', url: 'https://www.youtube.com/watch?v=q76bMs-NwRk', color: 'from-slate-500/20 to-blue-500/20' },
];

const MOODS = ['All', 'Focus', 'Deep Work', 'Creative', 'Energized', 'Calm', 'Study', 'Coding', 'Relaxed'];

export default function MusicVaultPage() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [filterMood, setFilterMood] = useState('All');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = filterMood === 'All' ? TRACKS : TRACKS.filter(t => t.mood === filterMood);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => setIsPlaying(p => !p);

  const nextTrack = () => {
    if (!currentTrack) return;
    const idx = filtered.findIndex(t => t.id === currentTrack.id);
    const next = shuffle
      ? filtered[Math.floor(Math.random() * filtered.length)]
      : filtered[(idx + 1) % filtered.length];
    playTrack(next);
  };

  const prevTrack = () => {
    if (!currentTrack) return;
    const idx = filtered.findIndex(t => t.id === currentTrack.id);
    const prev = filtered[(idx - 1 + filtered.length) % filtered.length];
    playTrack(prev);
  };

  // Simulate progress
  useEffect(() => {
    if (isPlaying) {
      progressRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            if (repeat) return 0;
            return 0;
          }
          return p + 0.1;
        });
      }, 300);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, repeat]);

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Music className="text-pink-400" size={24} /> Music Vault
            </h1>
            <p className="text-sm text-white/40 mt-0.5">Curated focus & study music · {TRACKS.length} tracks</p>
          </div>
        </div>

        {/* Now Playing */}
        {currentTrack && (
          <div className={cn('rounded-2xl p-5 mb-6 bg-gradient-to-r border border-white/10', currentTrack.color)}>
            <div className="flex items-center gap-4">
              <div className={cn('w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0', currentTrack.color, 'border border-white/20')}>
                <Music size={24} className="text-white/80" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate">{currentTrack.title}</p>
                <p className="text-sm text-white/60 truncate">{currentTrack.artist} · {currentTrack.genre}</p>
                {/* Progress bar */}
                <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white/60 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={currentTrack.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors" title="Open on YouTube">
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={() => setShuffle(s => !s)} className={cn('p-2 rounded-lg transition-colors', shuffle ? 'text-cyan-400' : 'text-white/30 hover:text-white/60')}>
                <Shuffle size={16} />
              </button>
              <button onClick={prevTrack} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <SkipBack size={20} />
              </button>
              <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all shadow-lg">
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <SkipForward size={20} />
              </button>
              <button onClick={() => setRepeat(r => !r)} className={cn('p-2 rounded-lg transition-colors', repeat ? 'text-cyan-400' : 'text-white/30 hover:text-white/60')}>
                <Repeat size={16} />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 mt-3">
              <button onClick={() => setMuted(m => !m)} className="text-white/40 hover:text-white/70 transition-colors">
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range" min={0} max={100} value={muted ? 0 : volume}
                onChange={e => { setVolume(Number(e.target.value)); setMuted(false); }}
                className="flex-1 h-1 accent-white"
              />
              <span className="text-xs text-white/30 w-8">{muted ? 0 : volume}%</span>
            </div>
          </div>
        )}

        {/* Mood filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {MOODS.map(mood => (
            <button
              key={mood}
              onClick={() => setFilterMood(mood)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all', filterMood === mood ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-white/05 text-white/50 hover:bg-white/10')}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Track list */}
        <div className="space-y-2">
          {filtered.map((track, i) => (
            <div
              key={track.id}
              onClick={() => playTrack(track)}
              className={cn(
                'group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all',
                currentTrack?.id === track.id
                  ? 'bg-gradient-to-r border border-white/15 ' + track.color
                  : 'hover:bg-white/05 border border-transparent'
              )}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-mono text-white/30 group-hover:text-white/60">
                {currentTrack?.id === track.id && isPlaying ? (
                  <div className="flex gap-0.5 items-end h-4">
                    {[1,2,3].map(b => (
                      <div key={b} className="w-1 bg-pink-400 rounded-full animate-bounce" style={{ height: `${Math.random() * 12 + 4}px`, animationDelay: `${b * 0.1}s` }} />
                    ))}
                  </div>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0', track.color, 'border border-white/10')}>
                <Music size={16} className="text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium truncate', currentTrack?.id === track.id ? 'text-white' : 'text-white/80')}>{track.title}</p>
                <p className="text-xs text-white/40 truncate">{track.artist}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-white/30 hidden sm:block">{track.genre}</span>
                {track.bpm > 0 && <span className="text-xs text-white/20 hidden md:block">{track.bpm} BPM</span>}
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full border', 'bg-white/05 text-white/40 border-white/10')}>{track.mood}</span>
                <a href={track.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-white/60 transition-colors">
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/20 text-center mt-6">
          Click any track to play · Links open on YouTube · All tracks are publicly available
        </p>
      </div>
    </AppShell>
  );
}
