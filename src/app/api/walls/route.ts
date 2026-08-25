import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { children, wallDesigns } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function GET() {
  await ensureSeedData();
  const rows = await db
    .select()
    .from(wallDesigns)
    .where(eq(wallDesigns.isActive, true))
    .orderBy(asc(wallDesigns.id));
  return NextResponse.json({ walls: rows });
}
export async function POST(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const body = await req.json();
  const [row] = await db
    .insert(wallDesigns)
    .values({
      name: String(body.name || "New Wall"),
      description: String(body.description || ""),
      backgroundCss: String(
        body.backgroundCss ||
          "linear-gradient(135deg,#450a0a,#14532d)"
      ),
      patternType: String(body.patternType || "custom"),
      primaryColor: String(body.primaryColor || "#450a0a"),
      secondaryColor: String(body.secondaryColor || "#14532d"),
      accentColor: String(body.accentColor || "#fbbf24"),
      isActive: true,
    })
    .returning();
  return NextResponse.json({ wall: row });
}
export async function PATCH(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  const body = await req.json();
  // Kids/parents can assign a wall to a child profile
  if (body.assignToChildId && body.wallDesignId) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const childId = Number(body.assignToChildId);
    const wallDesignId = Number(body.wallDesignId);
    const [child] = await db
      .select()
      .from(children)
      .where(eq(children.id, childId))
      .limit(1);
    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
    if (
      session.role === "child" &&
      session.childId !== childId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (
      session.role === "parent" &&
      session.parentId !== child.parentId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (session.role === "admin") {
      // ok
    } else if (session.role !== "child" && session.role !== "parent") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const [updated] = await db
      .update(children)
      .set({ wallDesignId })
      .where(eq(children.id, childId))
      .returning();
    return NextResponse.json({ child: updated });
  }
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const updates: Record<string, unknown> = {};
  for (const key of [
    "name",
    "description",
    "backgroundCss",
    "patternType",
    "primaryColor",
    "secondaryColor",
    "accentColor",
    "isActive",
  ]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  const [row] = await db
    .update(wallDesigns)
    .set(updates)
    .where(eq(wallDesigns.id, id))
    .returning();
  return NextResponse.json({ wall: row });
}
export async function DELETE(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.update(wallDesigns).set({ isActive: false }).where(eq(wallDesigns.id, id));
  return NextResponse.json({ ok: true });
}