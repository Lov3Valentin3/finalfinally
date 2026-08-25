import Link from "next/link";
import { ensureSeedData } from "@/lib/bootstrap";
import { getSession } from "@/lib/auth";
import { TwinkleLights } from "@/components/TwinkleLights";
import { Countdown } from "@/components/Countdown";
export const dynamic = "force-dynamic";
export default async function HomePage() {
  await ensureSeedData();
  const session = await getSession();
  const dashHref =
    session?.role === "admin"
      ? "/admin"
      : session?.role === "parent"
        ? "/parent"
        : session?.role === "child"
          ? "/kid"
          : null;
  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-20 pt-14 sm:px-6">
      <TwinkleLights />
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-10%] top-24 h-72 w-72 rounded-full bg-emerald-700/30 blur-3xl" />
        <div className="absolute right-[-10%] top-40 h-80 w-80 rounded-full bg-red-800/30 blur-3xl" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300/90">
              Santa&apos;s Workshop • Est. Forever
            </p>
            <h1 className="font-display mt-2 text-3xl font-black text-amber-100 sm:text-5xl">
              North Pole Pen Pal
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {dashHref ? (
              <Link href={dashHref} className="btn-magic btn-gold text-sm">
                Open Dashboard
              </Link>
            ) : null}
            <Link href="/admin/login" className="btn-magic btn-ghost text-sm">
              Admin
            </Link>
          </div>
        </header>
        <section className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="magical-card relative overflow-hidden rounded-[2rem] p-8 sm:p-10">
            <div className="absolute -right-8 -top-8 text-8xl opacity-20">🎄</div>
            <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Magical messaging for ages 3–12
            </p>
            <h2 className="font-display mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Make a forever friend
              <span className="block text-amber-300">living at the North Pole</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-amber-50/80 sm:text-lg">
              Step into Santa&apos;s workshop. Choose your elf pen pal, send instant magical
              messages, collect memories, and feel Christmas wonder all year long — with full
              parent controls and a safe, family-friendly experience.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link href="/parent/register" className="btn-magic btn-red">
                🎁 Parent Register
              </Link>
              <Link href="/parent/login" className="btn-magic btn-green">
                🍪 Parent Login
              </Link>
              <Link href="/kid/register" className="btn-magic btn-gold">
                🧝 Kid Register
              </Link>
              <Link href="/kid/login" className="btn-magic btn-ghost">
                ✉️ Kid Login
              </Link>
            </div>
            <p className="mt-6 text-sm text-emerald-100/70">
              Parents create an account first, then add children and pick an elf friend together.
            </p>
          </div>
          <div className="space-y-4">
            <div className="magical-card rounded-[2rem] p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Countdown to Christmas</p>
              <div className="mt-4">
                <Countdown />
              </div>
            </div>
            <div className="magical-card rounded-[2rem] p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Tonight in the workshop</p>
              <ul className="mt-4 space-y-3 text-sm text-amber-50/85">
                <li>✨ 20 unique elf friends with real personalities</li>
                <li>💬 Instant magical messaging that remembers your child</li>
                <li>🛡️ Parent inbox, activity tracking & subscriptions</li>
                <li>🎨 Customizable chat bubbles & wall designs</li>
                <li>🎵 Optional festive workshop music</li>
              </ul>
            </div>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Choose Your Elf",
              body: "Meet Jingle, Holly, Spark, Lumina and more — each with hobbies, treats, and a Christmas job.",
              emoji: "🧝",
            },
            {
              title: "Message the North Pole",
              body: "Kids send letters that feel like instant magic. Elves reply in character, kindly and imaginatively.",
              emoji: "📨",
            },
            {
              title: "Parents Stay in Control",
              body: "View every letter, manage multiple children, upgrade plans, and share the magic safely.",
              emoji: "👨‍👩‍👧",
            },
          ].map((f) => (
            <article key={f.title} className="magical-card rounded-3xl p-6">
              <div className="text-3xl">{f.emoji}</div>
              <h3 className="font-display mt-3 text-xl text-amber-200">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-50/75">{f.body}</p>
            </article>
          ))}
        </section>
        <section className="magical-card rounded-[2rem] p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl text-amber-200">Subscription sparkle</h3>
              <p className="mt-2 max-w-2xl text-sm text-amber-50/75">
                Start free, then unlock unlimited North Pole messaging whenever your family is ready.
              </p>
            </div>
            <Link href="/parent/register" className="btn-magic btn-gold text-sm">
              Begin the magic
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Free Starter",
                price: "$0",
                perks: ["1 child profile", "10 messages", "Elf welcome letter"],
              },
              {
                name: "Monthly Unlimited",
                price: "$7.99",
                perks: ["Unlimited messaging", "Multiple children", "Parent alerts"],
              },
              {
                name: "Yearly Wonder",
                price: "$59.99",
                perks: ["Best value", "All monthly perks", "Priority elf cheer"],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-amber-400/20 bg-black/40 p-5"
              >
                <p className="text-sm uppercase tracking-wider text-emerald-300">{plan.name}</p>
                <p className="font-display mt-2 text-3xl text-amber-300">{plan.price}</p>
                <ul className="mt-3 space-y-1 text-sm text-amber-50/80">
                  {plan.perks.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-amber-400/10 pt-6 text-xs text-amber-100/50">
          <p>© {new Date().getFullYear()} North Pole Pen Pal • Family-friendly Christmas magic</p>
          <div className="flex gap-4">
            <Link href="/support">Support</Link>
            <Link href="/admin/login">Workshop Admin</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
