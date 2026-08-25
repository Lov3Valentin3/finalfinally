import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityEvents, supportTickets } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function GET() {
  await ensureSeedData();
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role === "admin") {
    const rows = await db
      .select()
      .from(supportTickets)
      .orderBy(desc(supportTickets.createdAt));
    return NextResponse.json({ tickets: rows });
  }
  if (session.role === "parent" && session.parentId) {
    const rows = await db
      .select()
      .from(supportTickets)
      .where(eq(supportTickets.parentId, session.parentId))
      .orderBy(desc(supportTickets.createdAt));
    return NextResponse.json({ tickets: rows });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
export async function POST(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  const body = await req.json();
  const fromName = String(body.fromName || session?.name || "Parent").trim();
  const fromEmail = String(body.fromEmail || session?.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.body || "").trim();
  if (!fromName || !fromEmail || !subject || !message) {
    return NextResponse.json(
      { error: "All support fields are required." },
      { status: 400 }
    );
  }
  const [ticket] = await db
    .insert(supportTickets)
    .values({
      parentId: session?.parentId,
      fromName,
      fromEmail,
      subject,
      body: message,
      status: "open",
    })
    .returning();
  await db.insert(activityEvents).values({
    actorType: session?.role || "guest",
    actorId: session?.parentId || session?.adminId,
    eventType: "support_ticket_created",
    meta: { ticketId: ticket.id, subject },
  });
  return NextResponse.json({ ticket });
}
export async function PATCH(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }
  const body = await req.json();
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const [ticket] = await db
    .update(supportTickets)
    .set({
      adminReply: String(body.adminReply || ""),
      status: String(body.status || "replied"),
      repliedAt: new Date(),
    })
    .where(eq(supportTickets.id, id))
    .returning();
  await db.insert(activityEvents).values({
    actorType: "admin",
    actorId: session.adminId,
    eventType: "support_ticket_replied",
    meta: { ticketId: id },
  });
  return NextResponse.json({ ticket });
}