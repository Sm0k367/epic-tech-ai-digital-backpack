import { SpawnGlow } from '@/components/spawn-glow';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-5xl font-extrabold tracking-tight">Epic Tech AI</h1>
      <p className="text-xl text-gray-300">Digital Backpack – Self-Healing Creative Ecosystem</p>
      <div className="grid grid-cols-2 gap-4">
        <Tile href="/music-vault" label="Music Vault" />
        <Tile href="/code-vault" label="Code Vault" />
        <Tile href="/game-labs" label="Game Labs" />
        <Tile href="/chat-nexus" label="Chat Nexus" />
      </div>
    </main>
  );
}

function Tile({ href, label }: { href: string; label: string }) {
  return (
    <SpawnGlow>
      <a
        href={href}
        className="block px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
      >
        {label}
      </a>
    </SpawnGlow>
  );
}
