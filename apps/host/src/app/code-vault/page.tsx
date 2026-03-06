export default function CodeVaultPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-3xl font-bold">Code Vault</h2>
      <p className="text-gray-300">Collaborative IDE with CRDT sync – launching soon.</p>
      <a
        href="/"
        className="text-sm text-gray-400 hover:text-white underline"
      >
        ← Back to Backpack
      </a>
    </main>
  );
}
