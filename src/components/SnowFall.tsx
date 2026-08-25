"use client";
import { useEffect, useState } from "react";
type Flake = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
};
export function Snowfall({ count = 48 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);
  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        size: 3 + Math.random() * 7,
        duration: 8 + Math.random() * 14,
        delay: Math.random() * -20,
        opacity: 0.35 + Math.random() * 0.55,
      }))
    );
  }, [count]);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake absolute top-[-12px] rounded-full bg-white"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            boxShadow: "0 0 6px rgba(255,255,255,0.8)",
          }}
        />
      ))}
    </div>
  );
}
