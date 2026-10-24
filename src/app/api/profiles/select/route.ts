import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createSessionForUser, getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { profileId?: number } | null;
  const profileId = Number(body?.profileId);
  const [profile] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, session.userId)))
    .limit(1);
  if (!profile) return Response.json({ error: "Perfil não encontrado." }, { status: 404 });
  await createSessionForUser(session.userId, profile.id);
  return Response.json({ ok: true, profileId: profile.id });
}
