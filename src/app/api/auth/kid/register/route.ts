import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  activityEvents,
  children,
  elves,
  messages,
  notifications,
  parents,
  wallDesigns,
} from "@/db/schema";
import { getSession, hashPassword, setSessionCookie } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
import { buildWelcomeMessage } from "@/lib/elf-ai";
export async function POST(req: Request) {
  try {
    await ensureSeedData();
    const session = await getSession();
    const body = await req.json();
    const firstName = String(body.firstName || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const age = Number(body.age || 0);
    const favoriteColor = String(body.favoriteColor || "").trim();
    const favoriteActivity = String(body.favoriteActivity || "").trim();
    const elfId = Number(body.elfId || 0);
    const birthday = body.birthday ? String(body.birthday) : null;
    const parentEmail = body.parentEmail
      ? String(body.parentEmail).trim().toLowerCase()
      : null;
    if (
      !firstName ||
      !username ||
      password.length < 4 ||
      !age ||
      !favoriteColor ||
      !favoriteActivity ||
      !elfId
    ) {
      return NextResponse.json(
        { error: "Please complete all kid registration fields." },
        { status: 400 }
      );
    }
    let parentId = session?.role === "parent" ? session.parentId : undefined;
    if (!parentId && parentEmail) {
      const [parent] = await db
        .select()
        .from(parents)
        .where(eq(parents.email, parentEmail))
        .limit(1);
      parentId = parent?.id;
    }
    if (!parentId) {
      return NextResponse.json(
        {
          error:
            "Parent account required. Log in as a parent first, or provide parent email.",
        },
        { status: 400 }
      );
    }
    const existing = await db
      .select()
      .from(children)
      .where(eq(children.username, username))
      .limit(1);
    if (existing.length) {
      return NextResponse.json(
        { error: "That kid username is taken." },
        { status: 409 }
      );
    }
    const [elf] = await db.select().from(elves).where(eq(elves.id, elfId)).limit(1);
    if (!elf) {
      return NextResponse.json({ error: "Elf not found." }, { status: 404 });
    }
    const [defaultWall] = await db.select().from(wallDesigns).limit(1);
    const [child] = await db
      .insert(children)
      .values({
        parentId,
        username,
        passwordHash: await hashPassword(password),
        firstName,
        age,
        favoriteColor,
        favoriteActivity,
        birthday,
        elfId: elf.id,
        wallDesignId: defaultWall?.id,
        lastActiveAt: new Date(),
      })
      .returning();
    const welcome = buildWelcomeMessage(elf, {
      firstName,
      age,
      favoriteColor,
      favoriteActivity,
      birthday,
    });
    await db.insert(messages).values({
      childId: child.id,
      elfId: elf.id,
      sender: "elf",
      body: welcome,
      isRead: false,
    });
    await db.insert(notifications).values({
      parentId,
      childId: child.id,
      type: "new_letter",
      title: `${elf.name} wrote to ${firstName}!`,
      body: "A magical welcome letter just arrived from the North Pole.",
    });
    await db.insert(activityEvents).values({
      actorType: "child",
      actorId: child.id,
      eventType: "kid_registered",
      meta: { firstName, elfId: elf.id, parentId },
    });
    await setSessionCookie({
      sub: `child-${child.id}`,
      role: "child",
      name: child.firstName,
      childId: child.id,
      parentId,
    });
    return NextResponse.json({ ok: true, childId: child.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Kid registration failed." }, { status: 500 });
  }
}
