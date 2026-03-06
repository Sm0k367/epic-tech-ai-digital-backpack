export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-6xl font-extrabold">404</h1>
      <p className="text-gray-300">Lost in the void.</p>
      <a href="/" className="text-cyan-400 hover:underline">
        ← Return to Backpack
      </a>
    </main>
  );
}
