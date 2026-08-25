import { and, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  children,
  elves,
  messages,
  notifications,
  parents,
} from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function GET() {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "parent" || !session.parentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [parent] = await db
    .select()
    .from(parents)
    .where(eq(parents.id, session.parentId))
    .limit(1);
  const kids = await db
    .select()
    .from(children)
    .where(eq(children.parentId, session.parentId))
    .orderBy(desc(children.createdAt));
  const elfRows = await db.select().from(elves);
  const elfMap = Object.fromEntries(elfRows.map((e) => [e.id, e]));
  const kidIds = kids.map((k) => k.id);
  const letterRows =
    kidIds.length > 0
      ? await db
          .select()
          .from(messages)
          .where(inArray(messages.childId, kidIds))
          .orderBy(desc(messages.createdAt))
          .limit(200)
      : [];
  const notes = await db
    .select()
    .from(notifications)
    .where(eq(notifications.parentId, session.parentId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);
  return NextResponse.json({
    parent: {
      id: parent.id,
      name: parent.name,
      email: parent.email,
      subscriptionPlan: parent.subscriptionPlan,
      subscriptionStatus: parent.subscriptionStatus,
      shareMessage: parent.shareMessage,
    },
    children: kids.map((k) => ({
      ...k,
      passwordHash: undefined,
      elf: k.elfId ? elfMap[k.elfId] || null : null,
    })),
    messages: letterRows,
    notifications: notes,
  });
}
export async function PATCH(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "parent" || !session.parentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (body.subscriptionPlan) {
    const [parent] = await db
      .update(parents)
      .set({
        subscriptionPlan: String(body.subscriptionPlan),
        subscriptionStatus: "active",
      })
      .where(eq(parents.id, session.parentId))
      .returning();
    return NextResponse.json({ parent });
  }
  if (body.shareMessage !== undefined) {
    const [parent] = await db
      .update(parents)
      .set({ shareMessage: String(body.shareMessage) })
      .where(eq(parents.id, session.parentId))
      .returning();
    return NextResponse.json({ parent });
  }
  if (body.markNotificationsRead) {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.parentId, session.parentId),
          eq(notifications.isRead, false)
        )
      );
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
}