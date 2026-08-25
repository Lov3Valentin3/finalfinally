import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  admins,
  elves,
  musicTracks,
  quotes,
  wallDesigns,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import {
  DEFAULT_ELVES,
  DEFAULT_MUSIC,
  DEFAULT_QUOTES,
  DEFAULT_WALLS,
} from "@/lib/seed-data";
let bootstrapped = false;
export async function ensureSeedData() {
  if (bootstrapped) return;
  try {
    const [elfCount] = await db.select({ value: count() }).from(elves);
    if ((elfCount?.value ?? 0) === 0) {
      await db.insert(elves).values(
        DEFAULT_ELVES.map((e) => ({
          ...e,
          isActive: true,
        }))
      );
    }
    const [quoteCount] = await db.select({ value: count() }).from(quotes);
    if ((quoteCount?.value ?? 0) === 0) {
      await db.insert(quotes).values(
        DEFAULT_QUOTES.map((q) => ({ ...q, isActive: true }))
      );
    }
    const [wallCount] = await db.select({ value: count() }).from(wallDesigns);
    if ((wallCount?.value ?? 0) === 0) {
      await db.insert(wallDesigns).values(
        DEFAULT_WALLS.map((w) => ({ ...w, isActive: true }))
      );
    }
    const [musicCount] = await db.select({ value: count() }).from(musicTracks);
    if ((musicCount?.value ?? 0) === 0) {
      await db.insert(musicTracks).values(
        DEFAULT_MUSIC.map((m) => ({ ...m, isActive: true }))
      );
    }
    const [adminCount] = await db.select({ value: count() }).from(admins);
    if ((adminCount?.value ?? 0) === 0) {
      await db.insert(admins).values({
        email: "admin@northpole.app",
        name: "Workshop Admin",
        passwordHash: await hashPassword("admin123"),
      });
    } else {
      // Ensure default admin password remains usable in demo environments
      const existing = await db
        .select()
        .from(admins)
        .where(eq(admins.email, "admin@northpole.app"))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(admins).values({
          email: "admin@northpole.app",
          name: "Workshop Admin",
          passwordHash: await hashPassword("admin123"),
        });
      }
    }
    bootstrapped = true;
  } catch (error) {
    console.error("Seed failed", error);
  }
}
