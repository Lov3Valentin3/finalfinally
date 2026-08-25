"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
export default function SupportPage() {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk(false);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromName: fd.get("fromName"),
        fromEmail: fd.get("fromEmail"),
        subject: fd.get("subject"),
        body: fd.get("body"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Could not send");
      return;
    }
    setOk(true);
    e.currentTarget.reset();
  }
  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-16">
      <Link href="/" className="text-sm text-emerald-300">
        ← Home
      </Link>
      <div className="magical-card mt-4 rounded-3xl p-8">
        <h1 className="font-display text-3xl text-amber-100">Support & Help</h1>
        <p className="mt-2 text-sm text-amber-50/70">
          Parents can send questions or problems. Workshop admins reply from the admin dashboard.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input className="input-magic" name="fromName" placeholder="Your name" required />
          <input className="input-magic" name="fromEmail" type="email" placeholder="Email" required />
          <input className="input-magic" name="subject" placeholder="Subject" required />
          <textarea
            className="input-magic min-h-32"
            name="body"
            placeholder="How can we help?"
            required
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          {ok ? <p className="text-sm text-emerald-300">Message sent to the workshop!</p> : null}
          <button disabled={loading} className="btn-magic btn-green w-full" type="submit">
            {loading ? "Sending..." : "Send to North Pole Support"}
          </button>
        </form>
      </div>
    </main>
  );
}
