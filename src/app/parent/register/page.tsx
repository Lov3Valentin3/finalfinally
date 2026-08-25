"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
export default function ParentRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/parent/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
        plan: fd.get("plan"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }
    router.push("/kid/register");
    router.refresh();
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <div className="magical-card rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Parent registration</p>
        <h1 className="font-display mt-2 text-3xl text-amber-100">Open your workshop gate</h1>
        <p className="mt-2 text-sm text-amber-50/70">
          Create a parent account to manage kids, view every letter, and keep the magic safe.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Your name</span>
            <input className="input-magic" name="name" required placeholder="Alex Morgan" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Email</span>
            <input className="input-magic" name="email" type="email" required placeholder="you@email.com" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Password</span>
            <input className="input-magic" name="password" type="password" minLength={6} required placeholder="At least 6 characters" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Starting plan</span>
            <select className="input-magic" name="plan" defaultValue="monthly">
              <option value="free">Free Starter</option>
              <option value="monthly">Monthly Unlimited</option>
              <option value="yearly">Yearly Wonder</option>
            </select>
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button disabled={loading} className="btn-magic btn-red w-full" type="submit">
            {loading ? "Sprinkling snow..." : "Create Parent Account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-amber-50/60">
          Already registered?{" "}
          <Link className="text-amber-300 underline" href="/parent/login">
            Parent login
          </Link>
        </p>
      </div>
    </main>
  );
}
