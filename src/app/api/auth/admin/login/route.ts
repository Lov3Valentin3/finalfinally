import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { activityEvents, admins } from "@/db/schema";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
export async function POST(req: Request) {
  try {
    await ensureSeedData();
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);
    if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid admin credentials." },
        { status: 401 }
      );
    }
    await db.insert(activityEvents).values({
      actorType: "admin",
      actorId: admin.id,
      eventType: "admin_login",
      meta: { email },
    });
    await setSessionCookie({
      sub: `admin-${admin.id}`,
      role: "admin",
      email: admin.email,
      name: admin.name,
      adminId: admin.id,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Admin login failed." }, { status: 500 });
  }
}
