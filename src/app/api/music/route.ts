import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { musicTracks } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function GET() {
  await ensureSeedData();
  const rows = await db
    .select()
    .from(musicTracks)
    .where(eq(musicTracks.isActive, true))
    .orderBy(asc(musicTracks.sortOrder));
  return NextResponse.json({ tracks: rows });
}
export async function POST(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const body = await req.json();
  const [row] = await db
    .insert(musicTracks)
    .values({
      title: String(body.title || "Untitled"),
      artist: String(body.artist || "North Pole Orchestra"),
      url: String(body.url || ""),
      isActive: true,
      sortOrder: Number(body.sortOrder || 99),
    })
    .returning();
  return NextResponse.json({ track: row });
}
export async function DELETE(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db
    .update(musicTracks)
    .set({ isActive: false })
    .where(eq(musicTracks.id, id));
  return NextResponse.json({ ok: true });
}
