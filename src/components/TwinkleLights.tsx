export function TwinkleLights() {
  const colors = ["#fbbf24", "#ef4444", "#22c55e", "#38bdf8", "#f472b6", "#facc15"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-2 pt-2" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="twinkle h-2.5 w-2.5 rounded-full"
          style={{
            background: colors[i % colors.length],
            animationDelay: `${(i % 7) * 0.35}s`,
            boxShadow: `0 0 10px ${colors[i % colors.length]}`,
          }}
        />
      ))}
    </div>
  );
}
