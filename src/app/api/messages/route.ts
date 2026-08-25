import { and, asc, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  activityEvents,
  children,
  elves,
  messages,
  notifications,
  parents,
} from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
import { generateElfReply } from "@/lib/elf-ai";
export async function GET(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const childIdParam = searchParams.get("childId");
  let childId =
    session.role === "child"
      ? session.childId
      : childIdParam
        ? Number(childIdParam)
        : undefined;
  if (session.role === "parent" && childId) {
    const [child] = await db
      .select()
      .from(children)
      .where(
        and(eq(children.id, childId), eq(children.parentId, session.parentId!))
      )
      .limit(1);
    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
  }
  if (session.role === "admin" && !childId) {
    const rows = await db
      .select()
      .from(messages)
      .orderBy(desc(messages.createdAt))
      .limit(100);
    return NextResponse.json({ messages: rows });
  }
  if (!childId) {
    return NextResponse.json({ error: "childId required" }, { status: 400 });
  }
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.childId, childId))
    .orderBy(asc(messages.createdAt));
  if (session.role === "child") {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(and(eq(messages.childId, childId), eq(messages.sender, "elf")));
  }
  return NextResponse.json({ messages: rows });
}
export async function POST(req: Request) {
  try {
    await ensureSeedData();
    const session = await getSession();
    if (!session || session.role !== "child" || !session.childId) {
      return NextResponse.json({ error: "Kids only" }, { status: 401 });
    }
    const body = await req.json();
    const text = String(body.body || "").trim();
    if (!text) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }
    const [child] = await db
      .select()
      .from(children)
      .where(eq(children.id, session.childId))
      .limit(1);
    if (!child?.elfId) {
      return NextResponse.json({ error: "No elf selected" }, { status: 400 });
    }
    // Simple free-plan gate: unlimited for monthly/yearly, soft cap for free
    const [parent] = await db
      .select()
      .from(parents)
      .where(eq(parents.id, child.parentId))
      .limit(1);
    if (parent?.subscriptionPlan === "free") {
      const existing = await db
        .select()
        .from(messages)
        .where(and(eq(messages.childId, child.id), eq(messages.sender, "child")));
      if (existing.length >= 10) {
        return NextResponse.json(
          {
            error:
              "Free plan limit reached. Ask a parent to upgrade for unlimited magical messages!",
          },
          { status: 402 }
        );
      }
    }
    const [elf] = await db
      .select()
      .from(elves)
      .where(eq(elves.id, child.elfId))
      .limit(1);
    if (!elf) {
      return NextResponse.json({ error: "Elf missing" }, { status: 404 });
    }
    const [childMsg] = await db
      .insert(messages)
      .values({
        childId: child.id,
        elfId: elf.id,
        sender: "child",
        body: text,
        isRead: true,
      })
      .returning();
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.childId, child.id))
      .orderBy(asc(messages.createdAt));
    // Update wishes memory lightly
    const wishMatch = text.match(/i want ([^.!?]+)/i);
    if (wishMatch) {
      await db
        .update(children)
        .set({ christmasWishes: wishMatch[1].trim() })
        .where(eq(children.id, child.id));
      child.christmasWishes = wishMatch[1].trim();
    }
    const reply = generateElfReply({
      elf,
      child: {
        firstName: child.firstName,
        age: child.age,
        favoriteColor: child.favoriteColor,
        favoriteActivity: child.favoriteActivity,
        birthday: child.birthday,
        christmasWishes: child.christmasWishes,
        insideJokes: child.insideJokes,
      },
      history: history.map((h) => ({ sender: h.sender, body: h.body })),
      latestMessage: text,
    });
    const [elfMsg] = await db
      .insert(messages)
      .values({
        childId: child.id,
        elfId: elf.id,
        sender: "elf",
        body: reply,
        isRead: false,
      })
      .returning();
    await db.insert(notifications).values({
      parentId: child.parentId,
      childId: child.id,
      type: "new_letter",
      title: `${elf.name} replied to ${child.firstName}`,
      body: reply.slice(0, 180),
    });
    await db
      .update(children)
      .set({ lastActiveAt: new Date() })
      .where(eq(children.id, child.id));
    await db.insert(activityEvents).values({
      actorType: "child",
      actorId: child.id,
      eventType: "message_sent",
      meta: { elfId: elf.id, preview: text.slice(0, 80) },
    });
    return NextResponse.json({ childMessage: childMsg, elfMessage: elfMsg });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
