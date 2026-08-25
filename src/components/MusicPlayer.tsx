"use client";
import { useEffect, useRef, useState } from "react";
type Track = {
  id: number;
  title: string;
  artist: string | null;
  url: string;
};
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetch("/api/music")
      .then((r) => r.json())
      .then((d) => setTracks(d.tracks || []))
      .catch(() => undefined);
  }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tracks[index]) return;
    audio.src = tracks[index].url;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [index, tracks]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !tracks.length) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };
  if (!tracks.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio ref={audioRef} loop={false} onEnded={() => setIndex((i) => (i + 1) % tracks.length)} />
      {open && (
        <div className="mb-2 w-64 rounded-2xl border border-amber-400/30 bg-black/85 p-3 text-sm text-amber-50 shadow-2xl backdrop-blur">
          <p className="font-semibold text-amber-300">🎄 Workshop Radio</p>
          <p className="mt-1 truncate text-xs text-emerald-200">
            {tracks[index]?.title} — {tracks[index]?.artist}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + tracks.length) % tracks.length)}
              className="rounded-lg bg-zinc-800 px-2 py-1"
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={toggle}
              className="flex-1 rounded-lg bg-emerald-700 px-2 py-1 font-medium"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % tracks.length)}
              className="rounded-lg bg-zinc-800 px-2 py-1"
            >
              ⏭
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-red-800 to-emerald-900 text-xl shadow-lg shadow-red-950/50"
        aria-label="Toggle music player"
      >
        🎵
      </button>
    </div>
  );
}