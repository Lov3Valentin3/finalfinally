import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { elves } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function GET() {
  await ensureSeedData();
  const rows = await db
    .select()
    .from(elves)
    .where(eq(elves.isActive, true))
    .orderBy(asc(elves.sortOrder), asc(elves.id));
  return NextResponse.json({ elves: rows });
}
export async function POST(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const body = await req.json();
  const [row] = await db
    .insert(elves)
    .values({
      name: String(body.name || "New Elf"),
      gender: String(body.gender || "boy"),
      avatarEmoji: String(body.avatarEmoji || "🧝"),
      avatarColor: String(body.avatarColor || "#166534"),
      bio: String(body.bio || "A magical friend from the North Pole."),
      personality: String(body.personality || "Kind and playful"),
      hobbies: String(body.hobbies || "Making toys"),
      christmasJob: String(body.christmasJob || "Helps Santa"),
      favoriteTreats: String(body.favoriteTreats || "Cookies"),
      funFacts: String(body.funFacts || "Loves snow."),
      greetingStyle: String(body.greetingStyle || "Hello friend!"),
      isActive: body.isActive !== false,
      sortOrder: Number(body.sortOrder || 99),
    })
    .returning();
  return NextResponse.json({ elf: row });
}
export async function PATCH(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const body = await req.json();
  const id = Number(body.id);
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const updates: Record<string, unknown> = {};
  for (const key of [
    "name",
    "gender",
    "avatarEmoji",
    "avatarColor",
    "bio",
    "personality",
    "hobbies",
    "christmasJob",
    "favoriteTreats",
    "funFacts",
    "greetingStyle",
    "isActive",
    "sortOrder",
  ]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [row] = await db
    .update(elves)
    .set(updates)
    .where(eq(elves.id, id))
    .returning();
  return NextResponse.json({ elf: row });
}
export async function DELETE(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  await db.update(elves).set({ isActive: false }).where(eq(elves.id, id));
  return NextResponse.json({ ok: true });
}
