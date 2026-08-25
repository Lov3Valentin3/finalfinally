import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { children, elves, quotes, wallDesigns } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { ensureSeedData } from "@/lib/bootstrap";
import { getCountdownParts, quoteOfDay } from "@/lib/christmas";
export async function GET() {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "child" || !session.childId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [child] = await db
    .select()
    .from(children)
    .where(eq(children.id, session.childId))
    .limit(1);
  if (!child) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [elf] = child.elfId
    ? await db.select().from(elves).where(eq(elves.id, child.elfId)).limit(1)
    : [null];
  const walls = await db
    .select()
    .from(wallDesigns)
    .where(eq(wallDesigns.isActive, true));
  const wall =
    walls.find((w) => w.id === child.wallDesignId) || walls[0] || null;
  const activeQuotes = await db
    .select()
    .from(quotes)
    .where(eq(quotes.isActive, true));
  return NextResponse.json({
    child: {
      id: child.id,
      firstName: child.firstName,
      age: child.age,
      favoriteColor: child.favoriteColor,
      favoriteActivity: child.favoriteActivity,
      birthday: child.birthday,
      bubbleColor: child.bubbleColor,
      bubbleShape: child.bubbleShape,
      wallDesignId: child.wallDesignId,
      christmasWishes: child.christmasWishes,
    },
    elf,
    wall,
    walls,
    quote: quoteOfDay(activeQuotes),
    countdown: getCountdownParts(),
  });
}
export async function PATCH(req: Request) {
  await ensureSeedData();
  const session = await getSession();
  if (!session || session.role !== "child" || !session.childId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (body.bubbleColor) updates.bubbleColor = String(body.bubbleColor);
  if (body.bubbleShape) updates.bubbleShape = String(body.bubbleShape);
  if (body.wallDesignId) updates.wallDesignId = Number(body.wallDesignId);
  if (body.christmasWishes !== undefined) {
    updates.christmasWishes = String(body.christmasWishes);
  }
  if (body.insideJokes !== undefined) {
    updates.insideJokes = String(body.insideJokes);
  }
  const [child] = await db
    .update(children)
    .set(updates)
    .where(eq(children.id, session.childId))
    .returning();
  return NextResponse.json({
    child: {
      id: child.id,
      bubbleColor: child.bubbleColor,
      bubbleShape: child.bubbleShape,
      wallDesignId: child.wallDesignId,
    },
  });
}
