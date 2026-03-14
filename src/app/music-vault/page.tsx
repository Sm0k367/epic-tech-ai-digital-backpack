'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Music, ExternalLink, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  genre: string;
  mood: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 'ef5e6b4c-fd00-4070-ab4f-5a95f8ec5315',
    title: 'Let Me See You Go to Work',
    genre: 'Big Room',
    mood: 'Energized',
    color: 'from-pink-500/20 to-purple-500/20',
  },
  {
    id: '4eb5722c-08a3-48ac-81e1-8e506a2405ab',
    title: 'Low Lights, High Danger',
    genre: 'Big Room',
    mood: 'Intense',
    color: 'from-red-500/20 to-orange-500/20',
  },
  {
    id: 'daff476d-0b5d-4f71-97a2-cc2b85fb7f3c',
    title: 'One Night Only',
    genre: 'Electro-Funk',
    mood: 'Groove',
    color: 'from-yellow-500/20 to-orange-500/20',
  },
  {
    id: 'b5c79c4d-5151-42ca-a631-7730419b4e18',
    title: 'The OS of Funk',
    genre: 'Old School Hip-Hop',
    mood: 'Chill',
    color: 'from-green-500/20 to-teal-500/20',
  },
  {
    id: 'acfb57ed-982f-42ae-90c7-71640a891362',
    title: 'Go Hard (We Funk)',
    genre: 'Hip Hop',
    mood: 'Hype',
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    id: '10242707-d00a-4cae-9470-a88f7625e53f',
    title: 'Blue Money',
    genre: 'Electronic',
    mood: 'Focus',
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    id: 'fbacec1b-457a-4a29-9407-5ac4e5232a63',
    title: "The Devil's Summer",
    genre: '480-Seconds',
    mood: 'Dark',
    color: 'from-red-500/20 to-rose-500/20',
  },
  {
    id: '13a4fe1e-5ba5-409f-8492-f12cb716cf6a',
    title: 'Countdown',
    genre: 'Drum & Bass',
    mood: 'Energized',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'eda69867-6359-4f52-8a8d-b403fc26e6ba',
    title: "Good For Nothin' But Love",
    genre: 'Hip Hop',
    mood: 'Smooth',
    color: 'from-orange-500/20 to-yellow-500/20',
  },
];

const MOODS = ['All', 'Energized', 'Intense', 'Groove', 'Chill', 'Hype', 'Focus', 'Dark', 'Smooth'];

export default function MusicVaultPage() {
  const [activeId, setActiveId] = useState<string>(TRACKS[0].id);
  const [filterMood, setFilterMood] = useState('All');

  const filtered = filterMood === 'All' ? TRACKS : TRACKS.filter(t => t.mood === filterMood);
  const activeTrack = TRACKS.find(t => t.id === activeId) || TRACKS[0];

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Music className="text-pink-400" size={24} /> Music Vault
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              DJ Smoke Stream on Suno · {TRACKS.length} tracks
            </p>
          </div>
          <a
            href="https://suno.com/@dj_smoke_stream"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2 text-xs"
          >
            <Radio size={14} className="text-pink-400" />
            View Full Profile
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Active Player */}
        <div className={cn(
          'rounded-2xl p-5 mb-6 bg-gradient-to-r border border-white/10',
          activeTrack.color
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
              <Music size={16} className="text-pink-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{activeTrack.title}</p>
              <p className="text-xs text-white/50">DJ Smoke Stream · {activeTrack.genre}</p>
            </div>
            <a
              href={`https://suno.com/song/${activeTrack.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
              title="Open on Suno"
            >
              <ExternalLink size={15} />
            </a>
          </div>

          {/* Suno Embed */}
          <div className="w-full rounded-xl overflow-hidden">
            <iframe
              key={activeId}
              src={`https://suno.com/embed/${activeId}`}
              width="100%"
              height="240"
              frameBorder="0"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full rounded-xl"
              style={{ minWidth: 0 }}
            >
              <a href={`https://suno.com/song/${activeId}`}>Listen on Suno</a>
            </iframe>
          </div>
        </div>

        {/* Mood Filter */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {MOODS.map(mood => (
            <button
              key={mood}
              onClick={() => setFilterMood(mood)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                filterMood === mood
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'bg-white/05 text-white/50 hover:bg-white/10'
              )}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Track List */}
        <div className="space-y-2">
          {filtered.map((track, i) => (
            <div
              key={track.id}
              onClick={() => setActiveId(track.id)}
              className={cn(
                'group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border',
                activeId === track.id
                  ? `bg-gradient-to-r ${track.color} border-white/15`
                  : 'hover:bg-white/05 border-transparent hover:border-white/08'
              )}
            >
              {/* Number / active indicator */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-mono">
                {activeId === track.id ? (
                  <div className="flex gap-0.5 items-end h-4">
                    {[1, 2, 3].map(b => (
                      <div
                        key={b}
                        className="w-1 bg-pink-400 rounded-full animate-bounce"
                        style={{ height: `${[10, 14, 8][b - 1]}px`, animationDelay: `${b * 0.15}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-white/30 group-hover:text-white/60">{i + 1}</span>
                )}
              </div>

              {/* Art placeholder */}
              <div className={cn(
                'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 border border-white/10',
                track.color
              )}>
                <Music size={16} className="text-white/60" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium truncate',
                  activeId === track.id ? 'text-white' : 'text-white/80'
                )}>
                  {track.title}
                </p>
                <p className="text-xs text-white/40 truncate">DJ Smoke Stream · {track.genre}</p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-white/05 text-white/40 border-white/10 hidden sm:block">
                  {track.genre}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border bg-pink-500/10 text-pink-400/70 border-pink-500/20">
                  {track.mood}
                </span>
                <a
                  href={`https://suno.com/song/${track.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-white/60 transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/20 text-center mt-6">
          Click any track to load · Powered by Suno AI ·{' '}
          <a
            href="https://suno.com/@dj_smoke_stream"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400/50 hover:text-pink-400 transition-colors"
          >
            @dj_smoke_stream
          </a>
        </p>
      </div>
    </AppShell>
  );
}
