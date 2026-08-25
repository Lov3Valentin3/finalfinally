"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/admin/login", {
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
    router.push("/admin");
    router.refresh();
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="magical-card rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-red-300">Workshop control room</p>
        <h1 className="font-display mt-2 text-3xl text-amber-100">Admin Login</h1>
        <p className="mt-2 text-sm text-amber-50/70">
          Manage elves, quotes, wall designs, music, support mail, and live activity.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Admin email</span>
            <input
              className="input-magic"
              name="email"
              type="email"
              required
              defaultValue="admin@northpole.app"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Password</span>
            <input
              className="input-magic"
              name="password"
              type="password"
              required
              defaultValue="admin123"
            />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button disabled={loading} className="btn-magic btn-red w-full" type="submit">
            {loading ? "Unlocking..." : "Enter Admin Dashboard"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-amber-100/50">
          Demo: admin@northpole.app / admin123
        </p>
        <p className="mt-3 text-center text-sm">
          <Link href="/" className="text-emerald-300/80">
            ← Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
