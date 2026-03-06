export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-5xl font-extrabold tracking-tight">
        Epic Tech AI
      </h1>
      <p className="text-xl text-gray-300">
        Digital Backpack – Self-Healing Creative Ecosystem
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Card href="/music-vault" label="Music Vault" />
        <Card href="/code-vault" label="Code Vault" />
        <Card href="/game-labs" label="Game Labs" />
        <Card href="/chat-nexus" label="Chat Nexus" />
      </div>
    </main>
  );
}

function Card({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="px-6 py-4 rounded-lg bg-white/10 hover:bg-white/20 transition"
    >
      {label}
    </a>
  );
}
