"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
export default function KidLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/kid/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push("/kid");
    router.refresh();
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <div className="magical-card rounded-3xl p-8">
        <div className="text-4xl">🦌</div>
        <h1 className="font-display mt-3 text-3xl text-amber-100">Kid Login</h1>
        <p className="mt-2 text-sm text-amber-50/70">
          Enter your special username to visit your elf friend.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Username</span>
            <input className="input-magic" name="username" required placeholder="sparklekid" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-emerald-200">Password</span>
            <input className="input-magic" name="password" type="password" required />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button disabled={loading} className="btn-magic btn-gold w-full" type="submit">
            {loading ? "Flying north..." : "Enter the Workshop"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-amber-50/60">
          Need an account?{" "}
          <Link className="text-amber-300 underline" href="/kid/register">
            Kid register
          </Link>
        </p>
      </div>
    </main>
  );
}
