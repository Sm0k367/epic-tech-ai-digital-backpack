export function SpawnGlow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl p-px bg-gradient-to-br from-cyan-500 to-fuchsia-500">
      <div className="bg-black rounded-xl">{children}</div>
    </div>
  );
}
