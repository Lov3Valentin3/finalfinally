import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
export const parents = pgTable("parents", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  subscriptionPlan: varchar("subscription_plan", { length: 40 })
    .notNull()
    .default("free"),
  subscriptionStatus: varchar("subscription_status", { length: 40 })
    .notNull()
    .default("active"),
  shareMessage: text("share_message").default(
    "My child has a magical North Pole pen pal!"
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id")
    .notNull()
    .references(() => parents.id, { onDelete: "cascade" }),
  username: varchar("username", { length: 80 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  age: integer("age").notNull(),
  favoriteColor: varchar("favorite_color", { length: 60 }).notNull(),
  favoriteActivity: varchar("favorite_activity", { length: 120 }).notNull(),
  birthday: varchar("birthday", { length: 20 }),
  elfId: integer("elf_id"),
  wallDesignId: integer("wall_design_id"),
  bubbleColor: varchar("bubble_color", { length: 40 }).default("#166534"),
  bubbleShape: varchar("bubble_shape", { length: 40 }).default("rounded"),
  christmasWishes: text("christmas_wishes"),
  insideJokes: text("inside_jokes"),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const elves = pgTable("elves", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  avatarEmoji: varchar("avatar_emoji", { length: 16 }).notNull().default("🧝"),
  avatarColor: varchar("avatar_color", { length: 40 }).notNull().default("#166534"),
  bio: text("bio").notNull(),
  personality: text("personality").notNull(),
  hobbies: text("hobbies").notNull(),
  christmasJob: text("christmas_job").notNull(),
  favoriteTreats: text("favorite_treats").notNull(),
  funFacts: text("fun_facts").notNull(),
  greetingStyle: text("greeting_style").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .notNull()
    .references(() => children.id, { onDelete: "cascade" }),
  elfId: integer("elf_id")
    .notNull()
    .references(() => elves.id, { onDelete: "cascade" }),
  sender: varchar("sender", { length: 20 }).notNull(), // child | elf | system
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  author: varchar("author", { length: 120 }).default("North Pole"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const wallDesigns = pgTable("wall_designs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  description: text("description"),
  backgroundCss: text("background_css").notNull(),
  patternType: varchar("pattern_type", { length: 40 }).notNull().default("solid"),
  primaryColor: varchar("primary_color", { length: 40 }).notNull(),
  secondaryColor: varchar("secondary_color", { length: 40 }),
  accentColor: varchar("accent_color", { length: 40 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const musicTracks = pgTable("music_tracks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 120 }).notNull(),
  artist: varchar("artist", { length: 120 }).default("North Pole Orchestra"),
  url: text("url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id").references(() => parents.id, {
    onDelete: "set null",
  }),
  fromName: varchar("from_name", { length: 120 }).notNull(),
  fromEmail: varchar("from_email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  body: text("body").notNull(),
  status: varchar("status", { length: 40 }).notNull().default("open"),
  adminReply: text("admin_reply"),
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id")
    .notNull()
    .references(() => parents.id, { onDelete: "cascade" }),
  childId: integer("child_id").references(() => children.id, {
    onDelete: "cascade",
  }),
  type: varchar("type", { length: 60 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const activityEvents = pgTable("activity_events", {
  id: serial("id").primaryKey(),
  actorType: varchar("actor_type", { length: 40 }).notNull(),
  actorId: integer("actor_id"),
  eventType: varchar("event_type", { length: 80 }).notNull(),
  meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
