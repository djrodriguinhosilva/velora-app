import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { createSessionForUser, hashPassword } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
    name?: string;
  } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";
  const name = body?.name?.trim() || "Novo perfil";
  if (!email || !email.includes("@") || password.length < 6) {
    return Response.json({ error: "Use um e-mail válido e senha com ao menos 6 caracteres." }, { status: 400 });
  }
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return Response.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
  }
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash: await hashPassword(password),
      name,
      role: "user",
    })
    .returning();
  await db.insert(profiles).values({
    userId: user.id,
    name: name.split(" ")[0] || "Perfil",
    avatar: "gold",
  });
  await createSessionForUser(user.id);
  return Response.json({ ok: true });
}
