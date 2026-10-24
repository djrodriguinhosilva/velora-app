import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSessionForUser, verifyPassword } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await ensureSeeded();
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";
  if (!email || !password) {
    return Response.json({ error: "Informe e-mail e senha." }, { status: 400 });
  }
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: "Credenciais inválidas." }, { status: 401 });
  }
  await createSessionForUser(user.id);
  return Response.json({ ok: true, role: user.role });
}
