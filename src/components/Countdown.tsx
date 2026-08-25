"use client";
import { useEffect, useState } from "react";
import { getCountdownParts } from "@/lib/christmas";
export function Countdown() {
  const [parts, setParts] = useState(() => getCountdownParts());
  useEffect(() => {
    const id = setInterval(() => setParts(getCountdownParts()), 1000);
    return () => clearInterval(id);
  }, []);
  const cells = [
    { label: "Days", value: parts.days },
    { label: "Hours", value: parts.hours },
    { label: "Mins", value: parts.minutes },
    { label: "Secs", value: parts.seconds },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-amber-400/20 bg-black/50 px-2 py-3 text-center shadow-inner"
        >
          <div className="font-display text-2xl font-bold text-amber-300 md:text-3xl">
            {String(c.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200/80">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
