import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityEvents, parents } from "@/db/schema";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function POST(req: Request) {
  try {
    await ensureSeedData();
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const plan = String(body.plan || "monthly");
    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        { error: "Name, email, and password (6+ chars) are required." },
        { status: 400 }
      );
    }
    const existing = await db
      .select()
      .from(parents)
      .where(eq(parents.email, email))
      .limit(1);
    if (existing.length) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    const [parent] = await db
      .insert(parents)
      .values({
        name,
        email,
        passwordHash: await hashPassword(password),
        subscriptionPlan: plan,
        subscriptionStatus: "active",
      })
      .returning();
    await db.insert(activityEvents).values({
      actorType: "parent",
      actorId: parent.id,
      eventType: "parent_registered",
      meta: { email, plan },
    });
    await setSessionCookie({
      sub: `parent-${parent.id}`,
      role: "parent",
      email: parent.email,
      name: parent.name,
      parentId: parent.id,
    });
    return NextResponse.json({ ok: true, parentId: parent.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
