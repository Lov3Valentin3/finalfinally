import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityEvents, parents } from "@/db/schema";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function POST(req: Request) {
  try {
    await ensureSeedData();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const [parent] = await db
      .select()
      .from(parents)
      .where(eq(parents.email, email))
      .limit(1);
    if (!parent || !(await verifyPassword(password, parent.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }
    await db.insert(activityEvents).values({
      actorType: "parent",
      actorId: parent.id,
      eventType: "parent_login",
      meta: { email },
    });
    await setSessionCookie({
      sub: `parent-${parent.id}`,
      role: "parent",
      email: parent.email,
      name: parent.name,
      parentId: parent.id,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
