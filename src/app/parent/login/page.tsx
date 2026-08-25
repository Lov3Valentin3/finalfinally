"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
export default function ParentLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/parent/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push("/parent");
    router.refresh();
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="magical-card rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Parent portal</p>
        <h1 className="font-display mt-2 text-3xl text-amber-100">Welcome back</h1>
        <p className="mt-2 text-sm text-amber-50/70">
          Log in to manage children, letters, and your North Pole plan.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Email</span>
            <input className="input-magic" name="email" type="email" required placeholder="you@email.com" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Password</span>
            <input className="input-magic" name="password" type="password" required placeholder="••••••••" />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button disabled={loading} className="btn-magic btn-green w-full" type="submit">
            {loading ? "Opening workshop..." : "Parent Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-amber-50/60">
          New here?{" "}
          <Link className="text-amber-300 underline" href="/parent/register">
            Create a parent account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/" className="text-emerald-300/80">
            ← Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
