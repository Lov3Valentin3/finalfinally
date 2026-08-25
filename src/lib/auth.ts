import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const COOKIE_NAME = "northpole_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "north-pole-magic-secret-change-me-in-prod"
);
export type SessionRole = "parent" | "child" | "admin";
export type SessionPayload = {
  sub: string;
  role: SessionRole;
  email?: string;
  name: string;
  parentId?: number;
  childId?: number;
  adminId?: number;
};
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}
export async function readSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
export async function getSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return readSessionToken(token);
}
export function requireRole(session: SessionPayload | null, roles: SessionRole[]) {
  if (!session || !roles.includes(session.role)) {
    return false;
  }
  return true;
}
