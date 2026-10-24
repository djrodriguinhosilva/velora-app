import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";

const scrypt = promisify(scryptCb);
const COOKIE = "velora_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export type Session = {
  userId: number;
  profileId: number;
  email: string;
  name: string;
  role: "user" | "admin";
  exp: number;
};

function secret() {
  return process.env.SESSION_SECRET || "velora-dev-session-secret";
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const buf = (await scrypt(password, salt, 64)) as Buffer;
  const storedBuf = Buffer.from(hash, "hex");
  if (storedBuf.length !== buf.length) return false;
  return timingSafeEqual(storedBuf, buf);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodeSession(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(token: string | undefined | null): Session | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Session;
    if (!session?.userId || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  return decodeSession(jar.get(COOKIE)?.value);
}

export async function setSessionCookie(session: Session) {
  const jar = await cookies();
  jar.set(COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function createSessionForUser(userId: number, profileId?: number) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return null;
  const userProfiles = await db.select().from(profiles).where(eq(profiles.userId, user.id));
  const selected =
    userProfiles.find((p) => p.id === profileId) ?? userProfiles[0];
  if (!selected) return null;
  const session: Session = {
    userId: user.id,
    profileId: selected.id,
    email: user.email,
    name: user.name,
    role: user.role === "admin" ? "admin" : "user",
    exp: Date.now() + MAX_AGE * 1000,
  };
  await setSessionCookie(session);
  return session;
}

export function kidsAllowed(rating: string) {
  return ["L", "10", "12"].includes(rating);
}
