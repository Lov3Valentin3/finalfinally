import { count, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  activityEvents,
  children,
  elves,
  messages,
  musicTracks,
  parents,
  quotes,
  supportTickets,
  wallDesigns,
} from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function GET() {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [parentCount] = await db.select({ value: count() }).from(parents);
  const [childCount] = await db.select({ value: count() }).from(children);
  const [messageCount] = await db.select({ value: count() }).from(messages);
  const [openTickets] = await db
    .select({ value: count() })
    .from(supportTickets)
    .where(eq(supportTickets.status, "open"));
  const recentActivity = await db
    .select()
    .from(activityEvents)
    .orderBy(desc(activityEvents.createdAt))
    .limit(40);
  const recentMessages = await db
    .select({
      id: messages.id,
      sender: messages.sender,
      body: messages.body,
      createdAt: messages.createdAt,
      childId: messages.childId,
      childName: children.firstName,
      elfName: elves.name,
    })
    .from(messages)
    .leftJoin(children, eq(messages.childId, children.id))
    .leftJoin(elves, eq(messages.elfId, elves.id))
    .orderBy(desc(messages.createdAt))
    .limit(30);
  const planBreakdown = await db
    .select({
      plan: parents.subscriptionPlan,
      total: sql<number>`count(*)::int`,
    })
    .from(parents)
    .groupBy(parents.subscriptionPlan);
  const allElves = await db.select().from(elves).orderBy(desc(elves.id));
  const allQuotes = await db.select().from(quotes).orderBy(desc(quotes.id));
  const allWalls = await db.select().from(wallDesigns).orderBy(desc(wallDesigns.id));
  const allMusic = await db.select().from(musicTracks).orderBy(desc(musicTracks.id));
  const tickets = await db
    .select()
    .from(supportTickets)
    .orderBy(desc(supportTickets.createdAt))
    .limit(50);
  const allParents = await db
    .select({
      id: parents.id,
      name: parents.name,
      email: parents.email,
      subscriptionPlan: parents.subscriptionPlan,
      createdAt: parents.createdAt,
    })
    .from(parents)
    .orderBy(desc(parents.createdAt))
    .limit(50);
  const allKids = await db
    .select({
      id: children.id,
      firstName: children.firstName,
      age: children.age,
      username: children.username,
      parentId: children.parentId,
      elfId: children.elfId,
      lastActiveAt: children.lastActiveAt,
    })
    .from(children)
    .orderBy(desc(children.createdAt))
    .limit(50);
  return NextResponse.json({
    stats: {
      parents: parentCount.value,
      children: childCount.value,
      messages: messageCount.value,
      openTickets: openTickets.value,
    },
    planBreakdown,
    recentActivity,
    recentMessages,
    elves: allElves,
    quotes: allQuotes,
    walls: allWalls,
    music: allMusic,
    tickets,
    parents: allParents,
    children: allKids,
  });
}
