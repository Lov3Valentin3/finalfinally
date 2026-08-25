import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityEvents, children } from "@/db/schema";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function POST(req: Request) {
  try {
    await ensureSeedData();
    const body = await req.json();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const [child] = await db
      .select()
      .from(children)
      .where(eq(children.username, username))
      .limit(1);
    if (!child || !(await verifyPassword(password, child.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }
    await db
      .update(children)
      .set({ lastActiveAt: new Date() })
      .where(eq(children.id, child.id));
    await db.insert(activityEvents).values({
      actorType: "child",
      actorId: child.id,
      eventType: "kid_login",
      meta: { username },
    });
    await setSessionCookie({
      sub: `child-${child.id}`,
      role: "child",
      name: child.firstName,
      childId: child.id,
      parentId: child.parentId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
