export default function GameLabsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-3xl font-bold">Game Labs</h2>
      <p className="text-gray-300">Upload, remix, and play experimental games – WASM sandbox incoming.</p>
      <a
        href="/"
        className="text-sm text-gray-400 hover:text-white underline"
      >
        ← Back to Backpack
      </a>
    </main>
  );
}
