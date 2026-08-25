import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { quotes } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
import { quoteOfDay } from "@/lib/christmas";
export async function GET(req: Request) {
  await ensureSeedData();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  const rows = await db
    .select()
    .from(quotes)
    .where(eq(quotes.isActive, true))
    .orderBy(desc(quotes.id));
  if (all) {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 401 });
    }
    const every = await db.select().from(quotes).orderBy(desc(quotes.id));
    return NextResponse.json({ quotes: every });
  }
  return NextResponse.json({ quote: quoteOfDay(rows), quotes: rows });
}
export async function POST(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const body = await req.json();
  const [row] = await db
    .insert(quotes)
    .values({
      text: String(body.text || "").trim(),
      author: String(body.author || "North Pole"),
      isActive: body.isActive !== false,
    })
    .returning();
  return NextResponse.json({ quote: row });
}
export async function DELETE(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(quotes).where(eq(quotes.id, id));
  return NextResponse.json({ ok: true });
}
